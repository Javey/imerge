
IParser = require "../../lib/core/iParser"
should = require "should"
sinon = require "sinon"
Q = require "q"
path = require "path"
_ = require "lodash"


describe "iParser", () ->

    describe "#parse_css", () ->
        parser = new IParser ['a']
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
            

    describe "#filter_bg", () ->
        parser = new IParser ['a']
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
             
         

            
        

    describe "#parse()", () ->
        parser = null

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
            
    

