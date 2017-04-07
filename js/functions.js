/**
 * @description Функция создания нового html элемента
 * @param {type} options
 * @returns {Element|elem.el}
 */
function elem (options) {
    var o = options || null;
    var el = null;
    if (o.el === undefined) { el = document.createElement('div'); }
    else { el = document.createElement(o.el); }
    
    if (o.id !== undefined) { el.id = o.id; }
    if (o.class !== undefined) { el.className = o.class; }
    return el;
}
/**
 * @description Функция добавления нескольких элементов в родительский элемент
 * @param {type} el
 * @param {type} childs
 * @returns {undefined}
 */
function appendChilds(el, childs) {
    var childs = childs || null;
    if (childs === null) { return; }
    else {
        for (var i = 0; i < childs.length; i++) {
            el.appendChild(childs[i]);
        }
    }
}
/**
 * @description Функция добавления ноля, если цифра меньше 10
 * @param {type} data
 * @returns {String}
 */
function correction(data) {
    if (data < 10) {
        return "0" + data;
    }
    return data;
}
/**
 * @description Функция поиска предка по названию класса
 * @param {DOMelement} el Текущий элемент
 * @param {Object} options
 * @returns {DOMelement|null} 
 */
function parents(el, options) {
    var result = null;
    var tmp;
    var DOMelement = el || null;
    var param = options || null;
    if (DOMelement === null || param === null) {
        return null;
    }
    for (var i = 0; i < 1000; i++) {
        if (i === 0) {
            tmp = DOMelement.parentNode;
        } else {
            tmp = tmp.parentNode;
            if (tmp.nodeName === "#document") {
                break;
            }
        }
        if (tmp.classList.contains(param.class)) {
            result = tmp;
            break;
        }
    }
    return result;
}
