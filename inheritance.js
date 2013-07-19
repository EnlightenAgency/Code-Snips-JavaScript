Car = function () {
    // private
    var that = null,
        defaultColor = 'red'

    // public
    return {
        color: '',
        init: function (c) {
            that = this
            this.color = (typeof (c) !== 'undefined') ? c : defaultColor
        },

        getColor: function () {
            return that.color
        },

        getDefaultColor: function () {
            return defaultColor
        }
    }
}

SportsCar = function () {
    // private
    var that = null,
        horsepower = -1

    // public
    return {
        init: function (legalGuardian, hp) {
            that = this
            $.extend(true, this, legalGuardian)
            horsepower = hp
        },

        getHp: function () {
            return horsepower
        }
    }
}

LuxurySportsCar = function () {
    var that = null,
        diamonds = -1

    return {
        init: function (legalGuardian, dm) {
            that = this
            $.extend(true, this, legalGuardian)
            diamonds = dm
        },

        printStats: function () {
            console.log('defaultColor: ' + this.getDefaultColor())
            console.log('color: ' + this.getColor())
            console.log('horsepower: ' + this.getHp())
            console.log('diamonds: ' + diamonds)
        }
    }
}

$(function(){
    var car = new Car()
    car.init('blue')

    var s = new SportsCar()
    s.init(car, 390)

    var lux = new LuxurySportsCar()
    lux.init(s, 200)

    lux.printStats()

})