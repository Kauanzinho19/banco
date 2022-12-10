// ------------------------------------------------------------------------
// --- [ Templates acesso rapido ]
// ------------------------------------------------------------------------
function template_depositar(){
    return `
        <h1>Você quer <b>Depositar</b></h1>
        <p>Insira a quantidade que deseja depositar na conta. ${language.depositar.quantidade}</p>
        <input id="value" placeholder="EX: 500,000">
        <div class="btns">
            <button id="confirm" onclick="my_deposit(this)">${language.depositar.confirmar}</button>
            <button id="cancelar" onclick="closeModal()">${language.depositar.cancelar}</button>
        </div>
        <p>${language.depositar.warning}</p>
    `
}

function template_sacar(){
    return `
        <h1>Você quer <b>Sacar</b></h1>
        <p>Insira a quantidade que deseja depositar na conta. ${language.sacar.quantidade}</p>
        <input id="value" placeholder="EX: 500,000">
        <div class="btns">
            <button id="confirm" onclick="withdrawal(this)">${language.sacar.confirmar}</button>
            <button id="cancelar" onclick="closeModal()">${language.sacar.cancelar}</button>
        </div>
        <p>${language.sacar.warning}</p>
    `
}

function template_create_pix(){
    return `
        <h1>${language.pix.text1}</h1>
        <p>${language.pix.text2}</p>
        <input id="value" placeholder="${language.pix.text3}">
        <div class="btns">
            <button id="confirm" onclick="register_pix()">${language.pix.confirmar}</button>
            <button id="cancelar" onclick="closeModal()">${language.pix.cancelar}</button>
        </div>
        <p>${language.pix.warning}</p>
    `
}

function template_edit_pix(){
    return `
        <h1>${language.editpix.text1}</h1>
        <p>${language.editpix.text2}</p>
        <input id="value" placeholder="${language.editpix.text3}">
        <div class="btns">
            <button id="confirm" onclick="edit_pix_post()">${language.editpix.confirmar}</button>
            <button id="cancelar" onclick="closeModal()">${language.editpix.cancelar}</button>
        </div>
        <p>${language.editpix.warning}</p>
    `
}

const pix_template = () =>{
    return `
    <img src="assets/pix.png">

    <div class="btnContent" onclick="create_pix()">
        <div class="btnTitle">
            <div class="btnIcon" style="background:rgba(43, 203, 88, 0.71)"><i class="fa-solid fa-circle-plus"></i></div>
            <div class="btnText">${language.pixCreate.criar}</div>
        </div>
        <button>clique aqui</button>
    </div>
    <div class="btnContent" onclick="edit_pix()">
        <div class="btnTitle">
            <div class="btnIcon" style="background: #E7B636;"><i class="fa-solid fa-pen-circle"></i></div>
            <div class="btnText">${language.pixCreate.editar}</div>
        </div>
        <button>clique aqui</button>
    </div>
    <div class="btnContent" onclick="remove_pix()">
        <div class="btnTitle">
            <div class="btnIcon" style="background: #FF004D;"><i class="fa-solid fa-circle-xmark"></i></div>
            <div class="btnText">${language.pixCreate.remover}</div>
        </div>
        <button>clique aqui</button>
    </div>
    `
}

// ------------------------------------------------------------------------
// --- [ Templates HTML ]
// ------------------------------------------------------------------------
function template_modal(){
    return `
        <h1>Você está em <b>Transferencia</b></h1>
        <p>Insira o passaporte do cidadão e em seguida a quantidade que deseja transferir.</p>
        <b>${language.transferir.passaporte}</b>
        <input id="target" placeholder="EX: 1">
        <b>${language.transferir.quantidade}</b>
        <input id="value" placeholder="EX: 500,000">
        <div class="btns">
            <button id="confirm" onclick="enviar_transferia(this)">${language.transferir.confirmar}</button>
            <button id="cancelar" onclick="closeModal()">${language.transferir.cancelar}</button>
        </div>
        <p>${language.sacar.warning}</p>
    `
}

function template_history_trans(type,value){
    return `
    <div class="extract-item">
        <div class="item-info">
            <div class="icon"><i class="fas fa-search-dollar"></i></div>
            <p>${type}</p>
        </div>
        <span>${value}</span>
    </div>
    `
}

function template_item_multa(id,motivo,data,value,desc){
    return `
    <div class="item active-item multa-item" data-valor ="${value}" data-motivo= "${motivo}" data-dia="${data}"data-id="${id}"data-desc="${desc}">
        <div class="item-title">Multa: ${motivo}</div>
        <div class="item-info">
            <p>Data</p>
            <sub>${data}</sub>
        </div>
        <div class="item-info">
            <p>Descrição</p>
            <sub>${desc}</sub>
        </div>
        <button onclick="pay_select_multa(this)" data-id="${id}">Pagar Multa ( R$ ${formatarNumero(value)} )</button>
    </div>
    `
}

function tamplate_notify_sucess(title,message){
    return `
    <div class="svg">
        <svg class="checkmark success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark_circle_success" cx="26" cy="26" r="25" fill="none"/><path class="checkmark_check" stroke-linecap="round" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
    </div>
    <div class="line"></div>
    <div class="text">
        <span>${title}</span><br>
        <small>${message}</small>
    </div>
    `
}

function tamplate_notify_error(title,message){
    return `
    <div class="svg">
        <svg class="checkmark error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark_circle_error" cx="26" cy="26" r="25" fill="none"/><path class="checkmark_check" stroke-linecap="round" fill="none" d="M16 16 36 36 M36 16 16 36"/></svg>
    </div>
    <div class="line"></div>
    <div class="text">
        <span>${title}</span><br>
        <small>${message}</small>
    </div>
    `
}

function show_info_multa(motivo,id){
    return `
    <div class="pay-title">
        <div class="left flex-inline">
            <div class="pay-photo flex">wr</div>
            <div class="pay-info">
                <h3>${motivo}</h3>
                <sub>#${id}</sub>
            </div>
        </div>
        <button onclick="pay_select_multa(this)" data-id="${id}">${language.multas.pagar}</button>
    </div>
    <div class="pay-card">
        <div class="pay-tabel wrap">
            <h1>${language.multas.detalhes}</h1>
            <!-- Informações -->
            <label>${language.multas.motivo}</label>
            <span id="typeTraffic">${language.multas.text1}</span>
            <label>${language.multas.valor}</label>
            <span>${language.multas.moeda} <span id="priceTraffic">${language.multas.text2}</span></span>
            <label>${language.multas.nmulta}</label>
            <span>#<span id="numberTraffic">${language.multas.nencontrado}</span></span>
            <label>${language.multas.data}</label>
            <span id="dateTraffic">${language.multas.nencontrado}</span>
            <label>${language.multas.descricao}</label>
            <span id="noteTraffic">${language.multas.nencontrado}</span>
        </div>
        <div class="pay-fiscal">
            <div class="flex-inline">
                <div class="photo"></div>
                <div class="bar" style="margin-top: -20px !important;"></div>
            </div>
            <div class="flex-between">
                <div class="bar">
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                </div>
                <div class="bar">
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                </div>
                <div class="bar">
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                </div>
            </div>
            <div class="bar-footer">
                <div class="bar">
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                </div>
            </div>
        </div>
    </div>
    `
}

function template_rendimento(value){
    return `
    <div class="revenueItem">
        <div class="icon"></div>
        <div class="text">
            <span>${language.rendimento.text} ${language.rendimento.text1}</span>
            <small>$${language.rendimento.moeda} <b>${value}%</b></small>
        </div>
        <img src="assets/chartUP.png">
    </div>
    `
}
