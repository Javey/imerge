
IReplace = require "../../lib/core/iReplace"
should = require "should"
sinon = require "sinon"
Q = require "q"
path = require "path"
_ = require "lodash"

describe "iReplace", () ->
    replacer = null

    beforeEach () ->
        replacer = new IReplace

    describe "#matchSize", () ->
        it "nomral number", () ->
            m_1 = replacer.matchSize("12px")
            m_2 = replacer.matchSize("13")

            m_1[1].should.exactly "12"
            m_2[1].should.exactly "13"

        it "fix point number", () ->
            m_1 = replacer.matchSize("3.12px")
            m_2 = replacer.matchSize(".12px")

            m_1[1].should.exactly "3.12"
            m_2[1].should.exactly ".12"
            
        it "negative fix point number", () ->
            m_1 = replacer.matchSize("-3.12px")
            m_2 = replacer.matchSize("-.12px")

            m_1[1].should.exactly "-3.12"
            m_2[1].should.exactly "-.12"

        it "illegal number with more -", () ->
            m_1 = replacer.matchSize("-3-.12px")

            (m_1 == null).should.be.ok

        it "illegal number with more .", () ->
            m_1 = replacer.matchSize("3..12px")

            (m_1 == null).should.be.ok


    describe "#addPositionDecl", () ->
        declares = []

        it "normal position", () ->
            replacer.addPositionDecl declares, {left: 10, top: 20}, false
            declares.should.eql [{type: "declaration", property: "background-position", value: "-10px -20px"}]
        
        it "ie6 position", () ->
            replacer.addPositionDecl declares, {left: 30, top: 40}, true
            declares.should.eql [
                {type: "declaration", property: "background-position", value: "-10px -20px"}
                {type: "declaration", property: "_background-position", value: "-30px -40px"}
            ]
    
    describe "#setPosition", () ->
        position = {left: 5, top: 10}

        it "background with position in number", () ->
            values = "url(../image/red_1.png) 30px 40px repeat-x".split /\s+/g
            is_set = replacer.setPosition values, position

            values.should.eql ["url(../image/red_1.png)", "25px", "30px", "repeat-x"]
            is_set.should.ok

        it.skip "position in one number", () ->
            values = "30px".split /\s+/g
            is_set = replacer.setPosition values, position

            values.should.eql ["25px", "-10px"]
            is_set.should.ok

        it "position in direction, not implemented", () ->
            values = "center top".split /\s+/g
            is_set = replacer.setPosition values, position

            values.should.eql ["center", "top"]
            is_set.should.ok

        it "position in percentage, not implemented", () ->
            values = "10% 30%".split /\s+/g
            is_set = replacer.setPosition values, position

            is_set.should.not.ok
            
        it "background with no position info", () ->
            values = "false".split /\s+/g
            is_set = replacer.setPosition values, position

            is_set.should.not.ok

        
    describe "#rewriteBackgroundPosition", () ->
        rule = null
        position = null

        beforeEach () ->
            position = {left: 5, top: 10}
        
        it "background with position", () ->
            isHack = true
            rule = {declarations: [ {type: "declaration", property: "_background", value: "url(../image/red_1.png) 10px 40px repeat"} ]}
            bgDecls = rule.declarations
            replacer.rewriteBackgroundPosition rule, bgDecls, position, isHack

            rule.declarations.should.eql [
                {type: "declaration", property: "_background", value: "url(../image/red_1.png) 5px 30px repeat"}
            ]
            
        it "background with no position", () ->
            isHack = false
            rule = {declarations: [ {type: "declaration", property: "background", value: "url(../image/red_1.png) repeat"} ]}
            bgDecls = rule.declarations
            replacer.rewriteBackgroundPosition rule, bgDecls, position, isHack

            rule.declarations.should.eql [
                {type: "declaration", property: "background", value: "url(../image/red_1.png) repeat"}
                {type: "declaration", property: "background-position", value: "-5px -10px"}
            ]
        
        it "both background and background-position", () ->
            isHack = false
            rule = {declarations: [
                {type: "declaration", property: "background", value: "url(../image/red_1.png) repeat"}
                {type: "declaration", property: "background-position", value: "10px 40px"}
            ]}
            bgDecls = rule.declarations
            replacer.rewriteBackgroundPosition rule, bgDecls, position, isHack

            rule.declarations.should.eql [
                {type: "declaration", property: "background", value: "url(../image/red_1.png) repeat"}
                {type: "declaration", property: "background-position", value: "5px 30px"}
            ]
                 
        it.skip "two background-position", () ->
            isHack = false
            rule = {declarations: [
                {type: "declaration", property: "background-position", value: "10px 40px"}
                {type: "declaration", property: "background-position", value: "30px 70px"}
            ]}
            bgDecls = rule.declarations
            replacer.rewriteBackgroundPosition rule, bgDecls, position, isHack

            rule.declarations.should.eql [
                {type: "declaration", property: "background-position", value: "5px 30px"}
                {type: "declaration", property: "background-position", value: "25px 60px"}
            ]

        
    describe "#rewriteBackgroundSize", () ->
        it "50% background size (width & height) ", () ->
            position = {left: 10, top: 20}
            orig_info = {oriWidth: 80, oriHeight: 60}
            sprite_info = {width: 1000, height: 800}
            bgDecls = [
                {type: "declaration", property: "background", value: "url(../image/red_1.png) repeat"}
                {type: "declaration", property: "background-size", value: "40px 30px"}
            ]
            replacer.rewriteBackgroundSize bgDecls, orig_info, sprite_info, position

            bgDecls.should.eql [
                {type: "declaration", property: "background", value: "url(../image/red_1.png) repeat"}
                {type: "declaration", property: "background-size", value: "500px 400px"}
            ]
            position.should.eql {left: 5, top: 10}
        
        it "50% background size (only width) ", () ->
            position = {left: 10, top: 20}
            orig_info = {oriWidth: 80, oriHeight: 60}
            sprite_info = {width: 1000, height: 800}
            bgDecls = [
                {type: "declaration", property: "background", value: "url(../image/red_1.png) repeat"}
                {type: "declaration", property: "background-size", value: "40px"}
            ]
            replacer.rewriteBackgroundSize bgDecls, orig_info, sprite_info, position

            bgDecls.should.eql [
                {type: "declaration", property: "background", value: "url(../image/red_1.png) repeat"}
                {type: "declaration", property: "background-size", value: "500px"}
            ]
            position.should.eql {left: 5, top: 10}


    describe "#rewriteBackground", () ->

    
    
