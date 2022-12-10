let onBank = false


$(document).ready(function() {
    $('body').hide()
	window.addEventListener("message",function(data){
        let action = event.data;
        
		switch(action.type){
            case "show":
                start_bank_init(action.money,action.bank,action.logo,action.nome)
                start_pix_init(action.key_pix)
            break

            case "fechado":
                $("body").fadeIn(500)
                $('bank_section').hide()
                $('bankClose').html(`
                    <div class="icon">
                        <div class="circle">
                            <span class="dot"></span>
                        </div>
                        <span class="mark"></span>
                    </div>
                    <h1>${language.fechado.text1}</h1><br>
                    <sub>${language.fechado.text2}</sub>
                    <small>${language.fechado.text3} ${action.abertura}:00 ${language.fechado.text4} ${action.fechamento}:00</small>
                `)

                $('bankClose').fadeIn(500)
                setTimeout(function(){
                    close()
                },3500)
            break
            
            case "notify":
                if(!onBank){
                    $('bank_section').hide()
                }
                $("body").fadeIn(0)
                $('notify').fadeIn(500)
                if(action.mode == "sucesso"){
                    console.log(action.title,action.message)
                    $('notify').html(tamplate_notify_sucess(action.title,action.message));
                } else {
                    $('notify').html(tamplate_notify_error(action.title,action.message));
                }
                
                setTimeout(function(){
                    if(!onBank){
                        $("body").fadeOut(500)
                    }
                    $('notify').fadeOut(500)
                },6000)
            break
        }

      	document.onkeyup = function(data){
			if (data.which == 27){
                close()
			}
		};
	})
})

const start_bank_init = (wallet,bank,logo,nome) =>{
    onBank = true
    $("body").fadeIn(500)
    $('bankClose').hide()
    $("bank_section").fadeIn(500)
    get_trans()
    grafico()
    $('#limit').html("R$ " + formatarNumero(bank))
    $('#limit-wallet').html("R$ " + formatarNumero(wallet))
    $('.card-group .name').html(nome)
    $("section").fadeIn(500)
}

const start_pix_init = (key) =>{
    $('.pix-acess').html(pix_template())
    if (key == undefined) {
        key = language.pix.registrar
    }
    $('.pix-key').text(key)
}

function update_money(){
    $.post('https://banco/ws:update_money',JSON.stringify({}),(data)=>{
        $('#limit-wallet').html("R$ " + formatarNumero(data.money))
        $('#limit').html("R$ " + formatarNumero(data.bank))
    })
    
}

function close(){
    $("body").fadeOut(500)
    $('bank_section').hide()
    onBank = false
    $.post('https://banco/ws:close')
    setTimeout(function(){
        window.location.reload();
    },100)
}

function returnMenu_Trans(){
    $('.card-section').css('animation', 'slit-in-vertical 0.45s ease-out both');
    $('.back-card').hide();
    $('.front-card').fadeIn(300);
}

// ------------------------------------------------------------------------
// --- [ Botões de acesso rapido]
// ------------------------------------------------------------------------
function depositar(){
    $('modal').empty();
    $('modal').addClass('modalOpen')
    $('modal').append(template_depositar());
    $('main').css('filter', 'blur(10px)');
    $('modal').fadeIn(500);
}

function sacar(){
    $('modal').empty();
    $('modal').addClass('modalOpen')
    $('modal').append(template_sacar());
    $('main').css('filter', 'blur(10px)');
    $('modal').fadeIn(500);
}

function my_deposit(){
    let value = parseInt($('#value').val())
    if(value){
        $.post('https://banco/ws:depositar',JSON.stringify({value:value}))
        closeModal()
        setTimeout(function(){
            update_grafico()
        },1000)
    }
}

function withdrawal(){
    let value = parseInt($('#value').val())
    if(value){
        $.post('https://banco/ws:sacar',JSON.stringify({value:value}))
        closeModal()
        setTimeout(function(){
            update_grafico()
        },1000)
    }
}

function saque_rapido(value){
    $.post('https://banco/ws:sacar',JSON.stringify({value:value}))
    setTimeout(function(){
        update_transferencias()
        update_money()
        update_grafico()
    },1000)
}

// ------------------------------------------------------------------------
// --- [ Menu de transferencia para players]
// ------------------------------------------------------------------------

function open_transferencias(){
    $('modal').fadeIn(300);
    $('modal').html(template_modal());
    $('main').css('filter', 'blur(10px)');
}

function get_trans(){
    $.post('https://banco/ws:get_trans',JSON.stringify({}),(data)=>{
        const trans = data.trans
        trans.reverse()
        trans.forEach(function(v,i){
            $('.list-extract').append(template_history_trans(v.type,v.value))
        })
    })
}

function clear_trans(){
    $.post('https://banco/ws:limpar_transferencia',JSON.stringify({}))
    $('.list-extract').empty()
    setTimeout(function(){
        update_grafico()
    },500)
}

function update_transferencias(){
    $('.list-extract').empty()
    $.post('https://banco/ws:get_trans',JSON.stringify({}),(data)=>{
        const trans = data.trans
        trans.reverse()
        trans.forEach(function(v,i){
            $('.list-extract').append(template_history_trans(v.type,v.value))
        })
    })
}

const enviar_transferia = (element) => {
    let id = $(element).parent().parent().find('#target').val()
    let valor = $('#value').val()
    $.post('https://banco/ws:enviar_transferencia',JSON.stringify({id:id,valor:valor}))
    $('modal').fadeOut();
    $('main').css('filter', 'blur(0px)');
    setTimeout(function(){
        update_transferencias()
    },1000);
}

const closeModal = () =>{
    $('modal').hide();
    $('main').css('filter', 'blur(0px)');
    setTimeout(function(){
        update_transferencias()
        update_money()
    },1000)
}
// ------------------------------------------------------------------------
// --- [ Pix ]
// ------------------------------------------------------------------------

const update_key = () =>{
    $.post('https://banco/ws:update_key',JSON.stringify({}),(data)=>{
        $('.pix-key').text(data.chave)
    })
}

const create_pix = () => {
    $('modal').empty();
    $('modal').append(template_create_pix());
    $('main').css('filter', 'blur(10px)');
    $('modal').fadeIn(500);
}

const edit_pix = () =>{
    $('modal').empty();
    $('modal').append(template_edit_pix());
    $('main').css('filter', 'blur(10px)');
    $('modal').fadeIn(500);
}

const edit_pix_post = () =>{
    const key = $('#value').val().trim()
    if(key.length <= 10 &&  key.length > 0  ){
        $.post('https://banco/edit_pix',JSON.stringify({key:key}))
        $('modal').hide();
        $('main').css('filter', 'blur(0px)');
        setTimeout(function(){
            update_key()
        },1000)
    } else {
        $('.modal-warning').text(language.editpix.error)
        setTimeout(function(){
            $('.modal-warning').text(language.editpix.warning2)
        },3000)
    }
}

const remove_pix = () =>{
    $.post('https://banco/remove_pix',JSON.stringify({}))
    setTimeout(function(){
        $('.pix-key').text(language.pix.registrar)
    },1000)
}

const register_pix = () => {
    const key = $('#value').val().trim()
    if(key.length <= 10 && key.length > 0 ){
        $.post('https://banco/register_pix',JSON.stringify({key:key}))
        $('modal').hide();
        $('main').css('filter', 'blur(0px)');
        setTimeout(function(){
            update_key()
        },1000)
    } else {
       
        $('.modal-warning').text(language.pix.warning2)
        setTimeout(function(){
            $('.modal-warning').text(language.pix.warning)
        },3000)
    }
}
// ------------------------------------------------------------------------
// --- [ Sistema de multa ]
// ------------------------------------------------------------------------
const activeTraffic = (element) =>{
    $('main').css('filter', 'blur(5px)')
    $('modal').fadeIn();
    $('modal').html(`
        <h1>Veja todas as multas pendentes utilizando /multas pagar</h1>
        <div class="content-traffic"></div>
        <div class="btns">
            <button id="cancelar" onclick="closeModal()">Voltar</button>
        </div>
    `);

    $.post('https://banco/get_multas',JSON.stringify({}),(data) => {
        let multas = data.multas
        multas.reverse()
        multas.forEach(function(v, i){
            $('.content-traffic').append(template_item_multa(v.id_multa,v.motivo,v.time,v.valor,v.desc))
        })
    })

    $("#search-traffics").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".content-traffic .multa-item").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
}

function pay_select_multa(element){
    let id = element.dataset.id
    $.post('https://banco/pagar_multa', JSON.stringify({
        amount: Number(data.data[12])
    }))
    $('.pay-traffic').html('')
    setTimeout(function(){
        update_transferencias()
        multas_update()
        update_money()
    },500)
}

function multas_update(){
    $('.content-traffic').html('');
    $.post('https://banco/get_multas',JSON.stringify({}),(data) => {
        let multas = data.multas
        multas.reverse()
        multas.forEach(function(v, i){
            $('.content-traffic').append(template_item_multa(v.id_multa,v.motivo,v.time,v.valor,v.desc))
        })     
    })
}

function grafico(){
    let array = []
    $.post('https://banco/gerate_grafico',JSON.stringify({}),(data) => {
        let total = data.total
        array.ganhos = parseInt(gerate_value(total,data.ganhou))
        array.perdas = parseInt(gerate_value(total,data.perdeu))
        array.multas = parseInt(gerate_value(total,data.multas))
        setTimeout(function(){
            let labels = [
                language.grafico.ganhou,
                language.grafico.perdeu,
                language.grafico.multas,
            ];
            let dataConfig = {
                labels: labels,
                datasets: [{
                    data: [
                        data.ganhou,
                        data.perdeu,
                        data.multas,
                    ],
                    fill: true,
                    showLine: false,
                    backgroundColor: [
                        "#8ffe76",
                        "#FE7676",
                        "#fcfe76",
                    ],
                }],
            };
            let config = {
                type: 'line',
                data: dataConfig,
                options: {}
            };
            new Chart(document.getElementById('myChart'),config);
        })
    })  
}

function update_grafico(){
    let array = []
    $.post('https://banco/gerate_grafico',JSON.stringify({}),(data) => {
        let total = data.total
        array.ganhos = parseInt(gerate_value(total,data.ganhou))
        array.perdas = parseInt(gerate_value(total,data.perdeu))
        array.multas = parseInt(gerate_value(total,data.multas))
        setTimeout(function(){
            let labels = [
                language.grafico.ganhou,
                language.grafico.perdeu,
                language.grafico.multas,
            ];
            let dataConfig = {
                labels: labels,
                datasets: [{
                    data: [
                        data.ganhou,
                        data.perdeu,
                        data.multas,
                    ],
                    fill: true,
                    showLine: false,
                    backgroundColor: [
                        "#8ffe76",
                        "#FE7676",
                        "#fcfe76",
                    ],
                }],
            };
            let config = {
                type: 'line',
                data: dataConfig,
                options: {}
            };
            new Chart(document.getElementById('myChart'),config);
        })
    })  
}

function gerate_value(max,atual){
    let transform = (atual * 100) / max
    return transform
}

const formatarNumero = (n) => {
    if(!n) return n;
    var n = n.toString();
    var r = '';
    var x = 0;

    for (var i = n.length; i > 0; i--) {
        r += n.substr(i - 1, 1) + (x == 2 && i != 1 ? '.' : '');
        x = x == 2 ? 0 : x + 1;
    }

    return r.split('').reverse().join('');
}