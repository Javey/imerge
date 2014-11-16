
IParser = require "../../lib/core/iParser"
should = require "should"
sinon = require "sinon"
Q = require "q"
path = require "path"
_ = require "lodash"


describe "iParser", () ->
    parser = null

    beforeEach () ->
        parser = new IParser

    describe "#_parse_css", () ->
        css_file = path.resolve __dirname, "./a.css"
        css_ast = null

        beforeEach (done) ->
            parser._readFile(css_file).then(parser._parse_css).then((ast) ->
                css_ast = ast
                done()
            ).catch (error) -> console.log error


        it "selector correct", () ->
            _.pluck(css_ast.stylesheet.rules, "selectors").should.eql [[".alpha-1"], [".alpha-2"], [".alpha-3"]]

        it "merge declaration correct", () ->
            count = _.reduce css_ast.stylesheet.rules, (count, rule) ->
                found = _.where rule.declarations, {property: "merge"}
                return ~~(count) + !!found

            count.should.exactly 2


    describe "#_filter_bg", () ->
        bind = (fn_str) ->
            return _.bind parser[fn_str], parser
        filter = (css_str) ->
            return Q.fcall(() -> return css_str)
                .then(bind("_parse_css"))
                .then(bind("_filter_bg"))
                .catch (error) -> console.log error

        it "background", () ->
            css_str = ".alpha-1 { background: url(../image/red_1.png); merge: red; }"

            filter(css_str).then((result) ->
                result.should.eql [{
                    "bgDecls": [{
                        "type": "declaration",
                        "property": "background",
                        "value": "url(../image/red_1.png)",
                        "position": {
                            "source": undefined,
                            "start": {
                                "line": 1,
                                "column": 12
                            },
                            "end": {
                                "line": 1,
                                "column": 47
                            }
                        }
                    }],
                    "merge": "red",
                    "isHack": false
                }]
            )

        it "background-image", () ->
            css_str = ".alpha-1 { background-image: url(../image/red_1.png); merge: red; }"

            filter(css_str).then (result) ->
                result.length.should.exactly 1

        it "ie6 _background", () ->
            css_str = ".alpha-1 { _background: url(../image/red_1.png); merge: red; }"

            filter(css_str).then (result) ->
                (result[0] == undefined).should.be.false
                result[0].isHack.should.be.true
                result[0].merge.should.exactly 'red_ie6'


        it "background-repeat should not work", () ->
            css_str = ".alpha-1 { background-repeat: repeat; merge: red; }"

            filter(css_str).then (result) ->
                result.length.should.exactly 0


         it "no-merge should not work", () ->
            css_str = ".alpha-1 { background-image: url(../image/red_1.png);}"

            filter(css_str).then (result) ->
                result.length.should.exactly 0


    describe "#_handleBackgroundRepeat", () ->
        it "repeat-x", () ->
            parser._handleBackgroundRepeat("repeat-x").should.eql {float: "left", repeat: "x"}

        it "repeat-y", () ->
            parser._handleBackgroundRepeat("repeat-y").should.eql {float: "top", repeat: "y"}

        it "repeat", () ->
            parser._handleBackgroundRepeat("repeat").should.eql {repeat: "xy"}


    describe "#_handleBackgroundPosition", () ->
        it "one direction", () ->
            parser._handleBackgroundPosition("center").should.eql {float: "center"}

        it "one numeric", () ->
            parser._handleBackgroundPosition("20").should.eql {"padding-left": 20, "padding-right": 20}

        it "one numeric with px", () ->
            parser._handleBackgroundPosition("20px").should.eql {"padding-left": 20, "padding-right": 20}

        it "two numeric", () ->
            parser._handleBackgroundPosition("20").should.eql {"padding-left": 20, "padding-right": 20}
            parser._handleBackgroundPosition("30").should.eql {"padding-top": 30, "padding-bottom": 30}


    describe "#_handleBackgroundImage", () ->
        it "relative url", () ->
            parser._handleBackgroundImage("url(../image/red_1.png)")
                .should.eql {url: "../image/red_1.png"}

        it "http url", () ->
            parser._handleBackgroundImage("url(http://www.baidu.com/image/red_1.png)")
                .should.eql {}

        it "data:image", () ->
            parser._handleBackgroundImage("url(data:image/gif;base64,R0lGODlhAQAcALMAAMXh9)")
                .should.eql {}


    describe "#_handleBackground", () ->
        it "only image", () ->
            parser._handleBackground("url(/image/red_1.png)")
                .should.eql {url: "/image/red_1.png"}

        it "image with one position in direction ", () ->
            parser._handleBackground("url(/image/red_1.png) center")
                .should.eql {url: "/image/red_1.png", float: "center"}

        it "image with two position in direction ", () ->
            parser._handleBackground("url(/image/red_1.png) center top")
                .should.eql {url: "/image/red_1.png", float: "top"}

        it "image with two positions in direction, and repeat", () ->
            parser._handleBackground("url(/image/red_1.png) center top repeat-x")
                .should.eql {url: "/image/red_1.png", float: "left", repeat: "x"}

        it "image with one numeric position", () ->
            parser._handleBackground("url(/image/red_1.png) 12px")
            .should.eql {
                url: "/image/red_1.png"
                "padding-left": 12
                "padding-right": 12
            }

        it "image with two numeric positions and repeat", () ->
            parser._handleBackground("url(/image/red_1.png) 12px 13 repeat")
            .should.eql {
                url: "/image/red_1.png"
                repeat: "xy"
                "padding-left": 12
                "padding-right": 12
                "padding-top": 13
                "padding-bottom": 13
            }


    describe "#_getConfigByRule", () ->
        it "background with two positions in direction, and repeat", () ->
            config = parser._getConfigByRule "red", [
                {property: "background", value: "url(/image/red_1.png) center top repeat-x"}
            ], false
            config.should.eql {url: "/image/red_1.png", float: "left", repeat: "x"}

        it "background with isHack == true", () ->
            config = parser._getConfigByRule "red", [
                {property: "background", value: "url(/image/red_1.png)"}
            ], true
            config.should.eql {url: "/image/red_1.png"}

        it "background with background-repeat overwrite", () ->
            config = parser._getConfigByRule "red", [
                {property: "background", value: "url(/image/red_1.png) repeat-x"}
                {property: "background-repeat", value: "repeat-y"}
            ], true
            config.should.eql {url: "/image/red_1.png", float: "top", repeat: "y"}

        it "background with two numeric positions and repeat, background-position overwrite", () ->
            config = parser._getConfigByRule "red", [
                {property: "background", value: "url(/image/red_1.png) 2px 3 repeat"}
                {property: "background-position", value: "12px 13px"}
            ], true
            config.should.eql {
                url: "/image/red_1.png"
                repeat: "xy"
                "padding-left": 12
                "padding-right": 12
                "padding-top": 13
                "padding-bottom": 13
            }

        it "background with repeat, and repeat standalone", () ->
            config = parser._getConfigByRule "red", [
                {property: "background", value: "url(/image/red_1.png) repeat-x"}
                {property: "background-repeat", value: "repeat"}
            ], true
            config.should.eql {
                url: "/image/red_1.png"
                repeat: "xy"
            }


    describe "#_getAbsPathByUrl", () ->
        beforeEach () ->
            parser = new IParser ['a'], {webroot: "webroot"}

        it "absolute url", () ->
            parser._getAbsPathByUrl("/image/a.png").should.exactly "webroot/image/a.png"

        it "relative url", () ->
            parser._getAbsPathByUrl("../image/a.png", __filename).should.exactly path.join(__dirname, "../image/a.png")


    describe "#_setConfig", () ->
        beforeEach () ->
            parser = new IParser ['a'], {webroot: "webroot"}

        it "two float", () ->
            catched = 0

            parser._setConfig "red", "url_1", "key_1", {url: "/image/red_1.png", float: "top", repeat: "y"}
            try
                parser._setConfig "red", "url_1", "key_1", {url: "/image/red_1.png", float: "left", repeat: "x"}
            catch e
                catched = 1

            catched.should.exactly 1


    describe "#parse()", () ->
        beforeEach () ->
            parser = new IParser ['a']
            stub_parse = sinon.stub parser, "_parse"
            stub_readFile = sinon.stub parser, "_readFile", (file) ->
                return Q.fcall () -> return 'foobar'

        it "return an empty config", () ->
            parser.parse().then (config) ->
                config.should.eql {}

        it "return the given config", () ->
            parser.config = c = {a: 1, b: 2}
            parser.parse().then (config) ->
                config.should.eql c



