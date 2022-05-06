const actions = document.querySelector(".sidebar>.messaging-actions")
const html = 
`<div class="connor-base">
    <div class="messaging-actions__action">
        <div class="messaging-actions__data">
            <span class="messaging-actions__label">Conectando...</span>
            <span class="messaging-actions__hint">Cambiar estado</span>
        </div>
        <svg class="connor-svg connor-inactive" width="5px" height="8px" viewBox="0 0 9 14" xmlns="http://www.w3.org/2000/svg">
            <path fill="#B4B4B4" d="M8.12 6.96a.48.48 0 0 0-.14-.32L1.48.14A.48.48 0 0 0 1.157 0a.48.48 0 0 0-.32.14L.14.837a.48.48 0 0 0-.14.32.48.48 0 0 0 .14.322l5.482 5.48L.14 12.444a.48.48 0 0 0-.14.32c0 .127.056.238.14.32l.697.7a.48.48 0 0 0 .32.14.48.48 0 0 0 .322-.14l6.5-6.5a.48.48 0 0 0 .14-.323z" fill-rule="evenodd"></path>
        </svg>
    </div>
    <div class="connor-action-container connor-inactive">
        <div class="connor-action messaging-actions__action messaging-actions__label">
            No Aplica
        </div>
        <div class="connor-action messaging-actions__action messaging-actions__label"">
            Datos Recibidos
        </div>
        <div class="connor-action messaging-actions__action messaging-actions__label"">
            Facturado
        </div>
    </div>
</div>`
let status_node
let button_nodes
let username

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function sendUpdate(value){
    browser.runtime.sendMessage({
        type: "02",
        name: username,
        data_name: "bill_status",
        value: value
      })
}

function inject(){
    let node = htmlToElement( html )
    let svg = node.querySelector( ".connor-base>.messaging-actions__action>svg" )
    let container = node.querySelector( ".connor-action-container" )
    let base_button = node.querySelector( ".connor-base>.messaging-actions__action" )
    status_node = node.querySelector( ".connor-base>.messaging-actions__action messaging-actions__label" )
    buttons = node.querySelectorAll( ".connor-action-container>.connor-action" )

    buttons[0].addEventListener("click",e=> sendUpdate("nothing") )
    buttons[1].addEventListener("click",e=> sendUpdate("data") )
    buttons[2].addEventListener("click",e=> sendUpdate("bill") )

    base_button.addEventListener("click", e=>{
        svg.classList.toggle("connor-inactive")
        container.classList.toggle("connor-inactive")
    })
    actions.appendChild( node )
}

function getName(){
    username = document.querySelector( ".nav-header-user .nav-header-username" ).innerText
}

function init(){
    inject()
    getName()
    browser.runtime.sendMessage({
        type: "03",
        name: username,
        data_name: "bill_status"
      })
}

const var_values = {
    "00":"ERROR",
    "":"No Aplica",
    "nothing":"No Aplica",
    "data":"Datos Recibidos",
    "bill":"Facturado"
}

const fn_local = {
    "00": data =>{
        status_node.innerText = "ERROR"
    },
    "02": data =>{
        if( data.status === "error") status_node.innerText = "ERROR"
    },
    "03": data =>{
        status_node.innerText = var_values[data.value]
    }
}

browser.runtime.onMessage.addListener(data => {
    fn_local[data.type]?.(data)
});