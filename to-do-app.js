
const template = document.createElement('template');
template.innerHTML = `

<link rel="stylesheet" href="./css/all.css">
<style>
    :host {
    display: block;
    text-align: center;
    font-family: thinFont;
    }

    ul {
    list-style: none;
    padding: 0;
    }

    h3{
        text-decoration: underline ;
        text-decoration-color: #D21F70;
    }

    .inputBtn{
        padding: 8px;
        font-size: 18px;
        font-family: thinFont;
    }
    .plus{
        font-size: 24px;
        cursor: pointer;
        color: #D21F70;
    }
</style>
<h3>TO DO:</h3>

<input class="inputBtn" type="text" placeholder="Add a new to do"></input>
<i class="fas fa-plus-circle plus" title="Click - Add task"></i>
<hr>

<ul id="todos"></ul>

`;


class ToDoApp extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        this.$todoList = this._shadowRoot.querySelector('ul');
        this.$input = this._shadowRoot.querySelector('input');

        this.$submitButton = this._shadowRoot.querySelector('.fa-plus-circle');
        this.$submitButton.addEventListener('click', this._addTodo.bind(this));


    }

    _toggleTodo(e) {
        const todo = this._todos[e.detail];
        this._todos[e.detail] = Object.assign({}, todo, {
            checked: !todo.checked
        });
        this._renderTodoList();
    }


    _renderTodoList() {
        this.$todoList.innerHTML = '';

        this._todos.forEach((todo, index) => {

            let $todoItem = document.createElement('to-do-item');
            $todoItem.setAttribute('text', todo.text);

            if (todo.checked) {
                $todoItem.setAttribute('checked', '');
            }

            $todoItem.setAttribute('index', index);
            $todoItem.addEventListener('onRemove', this._removeTodo.bind(this));
            $todoItem.addEventListener('onToggle', this._toggleTodo.bind(this));

            this.$todoList.appendChild($todoItem);

        });
    }

    set todos(value) {
        this._todos = value;
        this._renderTodoList();
    }

    get todos() {
        return this._todos;
    }

    _addTodo() {
        if (this.$input.value.length > 0) {
            this._todos.push({ text: this.$input.value, checked: false })
            this._renderTodoList();
            this.$input.value = '';
        }
    }

    _removeTodo(e) {
        this._todos.splice(e.detail, 1);
        this._renderTodoList();
    }



}


window.customElements.define('to-do-app', ToDoApp);

document.querySelector('to-do-app').todos = [];


