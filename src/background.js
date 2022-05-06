const socket = new WebSocket( 'ws://localhost:8080/ws' )

const fn_input = {
    "01": arr =>{
        let reason = arr[1]
        socket.close() 
    },
    "02": arr =>{
        let id = arr[1]
        let status = arr[2]
        browser.tabs.sendMessage( id, { type: "02", status: status } ) // Set response
    },
    "03": arr =>{
        let id = arr[1]
        let value = arr[2]
        browser.tabs.sendMessage( id, { type: "03", value:value } ) // Get response
    }
}

socket.addEventListener('message', event => {
    let data = `${event.data}`;
    let splited_data = data.split( ":" )
    let regex = {
       "01":/^01:[\w\s]+$/,
       "02":/^02:(ok|error)$/,
       "03":/^03:[a-z0-9]+$/
    }
    if ( regex[splited_data[0]]?.test( data ) ){
        fn_input[splited_data[0]](splited_data)
    }
} )

const fn_output = {
    "02": (id, data) =>{
        // (name,data_name,value)
        if( socket.readyState != 1 ) {
            browser.tabs.sendMessage( id, { type: "00" } ) // Server not ready
        } else {
            socket.send(`03:${id}:${data.name}:${data.data_name}:${data.value}`)
        }
    },
    "03": (id, data) =>{
        // (id,name,data_name)
        if( socket.readyState != 1 ) {
            browser.tabs.sendMessage( id, { type: "00" } ) // Server not ready
        } else {
            socket.send(`03:${id}:${data.name}:${data.data_name}`)
        }
    }
}

browser.runtime.onMessage.addListener( ( data, sender ) => {
        let id = sender.tab.id
        fn_output[ data.type ]?.( id, data )
    }
);