const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" href="./css/all.css">
<style>
    :host {
    display: block;
    font-family: thinFont;
    }

    label{
        font-size: 26px;
        margin: 0px;
    }

    .completed {
    text-decoration: line-through;
    }

    .minus{
        font-size: 24px;
        cursor: pointer;
        color: #D2791F;
    }
    .item{
   margin-top: 4px;
   margin-bottom: 4px;
    }
    .paddingItem{
        padding-left: 4px;
        padding-right: 4px;
    }
    .paddingTop{
        padding-top: 8px;
    }
    .marginTop{
        margin-top: 14px;
    }


    .flex-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>
<li class="item flex-container">
    <input class="paddingTop marginTop" type="checkbox">
    <label class="paddingItem"></label>
    <i class="fas fa-minus-circle minus paddingItem paddingTop" title="Click - Remove task"></i>
</li>
`;

class TodoItem extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        this.$item = this._shadowRoot.querySelector('.item');
        this.$removeButton = this._shadowRoot.querySelector('.fa-minus-circle');
        this.$text = this._shadowRoot.querySelector('label');
        this.$checkbox = this._shadowRoot.querySelector('input');

        this.$removeButton.addEventListener('click', (e) => {
            this.dispatchEvent(new CustomEvent('onRemove', { detail: this.index, composed: true, bubbles: true }));
        });

        this.$checkbox.addEventListener('click', (e) => {
            this.dispatchEvent(new CustomEvent('onToggle', { detail: this.index }));
        });

    }

    connectedCallback() {
        // We set a default attribute here; if our end user hasn't provided one,
        // our element will display a "placeholder" text instead.
        if (!this.hasAttribute('text')) {
            this.setAttribute('text', 'placeholder');
        }

        this._renderTodoItem();
    }

    _renderTodoItem() {
        if (this.hasAttribute('checked')) {
            this.$text.classList.add('completed');
            this.$checkbox.setAttribute('checked', '');
        } else {
            this.$text.classList.remove('completed');
            this.$checkbox.removeAttribute('checked');
        }

        this.$text.innerHTML = this._text;
    }

    static get observedAttributes() {
        return ['text', 'checked', 'index'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'text':
                this._text = newValue;
                break;
            case 'checked':
                this._checked = this.hasAttribute('checked');
                break;
            case 'index':
                this._index = parseInt(newValue);
                break;
        }
    }

    set index(val) {
        this.setAttribute('index', val);
    }

    get index() {
        return this._index;
    }

    get checked() {
        return this.hasAttribute('checked');
    }

    set checked(val) {
        if (val) {
            this.setAttribute('checked', '');
        } else {
            this.removeAttribute('checked');
        }
    }

}

window.customElements.define('to-do-item', TodoItem);