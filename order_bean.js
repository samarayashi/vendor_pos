function set_data(id, sheet, fort, normal, french) {
    return {
        $id: id,
        $sheet: sheet,
        $fort: fort,
        $normal: normal,
        $french: french
    }
}

// const ID = Symbol(), SHEET = Symbol(),FORT = Symbol(), NORMAL=Symbol(), FRENCH=Symbol();
class order {
    constructor(id, sheet, fort, normal, french) {
        var _id = id;
        var _sheet = sheet;
        var _fort = fort;
        var _normal = normal;
        var _french = french;

        this.data = {
            $id: _id,
            $sheet: _sheet,
            $fort: _fort,
            $normal: _normal,
            $french: _french
        }
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }

    get sheet() {
        return this._sheet;
    }
    set sheet(value) {
        this._sheet = value;
    }

    get fort() {
        return this._fort;
    }
    set fort(value) {
        this._fort = value;
    }

    get _normal() {
        return this._normal;
    }
    set normal(value) {
        this._normal = value;
    }

    get french() {
        return this._french;
    }
    set french(value) {
        this._french = value;
    }
}

var test = new order(1, 2, 3, 4, 5)
console.log(test.data)




// var data = {
//     $id: 20201127,
//     $sheet: 003,
//     $fort: 8,
//     $normal: 5,
//     $french: 0
// }