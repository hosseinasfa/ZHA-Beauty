import autoBind from 'auto-bind';

module.exports = class controller {
    constructor() {
        autoBind(this);
    }
}

