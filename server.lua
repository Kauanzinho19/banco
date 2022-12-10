local Tunnel = module("vrp","lib/Tunnel")
local Proxy = module("vrp","lib/Proxy")
local config = module("banco","config")
vRP = Proxy.getInterface("vRP")

sv = {}
Tunnel.bindInterface('banco',sv)
Proxy.addInterface('banco',sv)

crl = Tunnel.getInterface('banco')

vRP.prepare("space/getinfos","SELECT * FROM vrp_user_identities WHERE user_id = @user_id")
vRP.prepare("space/updatepix","UPDATE vrp_user_identities SET pix = @pix WHERE user_id = @user_id")
vRP.prepare("space/removepix","UPDATE vrp_user_identities SET pix = NULL WHERE user_id = @user_id")
vRP.prepare("space/updatetransferencia","UPDATE vrp_user_identities SET transferencia = @transferencia WHERE user_id = @user_id")

function sv.gettransferencia()
    local source = source
    local user_id = vRP.getUserId(source)
    local transferencia = json.decode(vRP.query("space/getinfos",{user_id = user_id})[1].transferencia) or {}
    return transferencia
end

function setTransferencia(user_id,type,value)
    local Transferencia = json.decode(vRP.query("space/getinfos",{user_id = user_id})[1].transferencia) or {}
    Transferencia[#Transferencia+1] = {
        type = type, 
        value = value
    }
    vRP.execute("space/updatetransferencia",{user_id = user_id, transferencia = json.encode(Transferencia)})
end


function sv.get_player_info()
    local user_id = vRP.getUserId(source)
    local identity = vRP.getUserIdentity(user_id)
    return vRP.getMoney(user_id), vRP.getBankMoney(user_id), identity.name.." "..identity.firstname
end

function sv.get_key_pix()
    local user_id = vRP.getUserId(source)
    local pix = vRP.query("space/getinfos",{user_id = user_id})
    return pix[1].pix
end

function sv.create_pix(key)
    local user_id = vRP.getUserId(source)
    vRP.execute("space/updatepix",{user_id = user_id, pix = key})
end

function sv.edit_pix(key)
    local user_id = vRP.getUserId(source)
    vRP.execute("space/updatepix",{user_id = user_id, pix = key})
end

function sv.remove_pix()
    local user_id = vRP.getUserId(source)
    vRP.execute("space/removepix",{user_id = user_id, pix = ""})
end

function sv.sacar(value)
    local user_id = vRP.getUserId(source)
	local identity = vRP.getUserIdentity(user_id)
	if value == nil or value <= 0 or value > vRP.getBankMoney(user_id) then
        TriggerClientEvent("bank_notify",source,"negado","Valor","Valor inválido")
		TriggerClientEvent("Notify",source,"negado","Valor inválido")
	else
		vRP.tryWithdraw(user_id,value)
        setTransferencia(user_id,"Saque",value)
        TriggerClientEvent("bank_notify",source,"sucesso","Saque","Você sacou $"..vRP.format(parseInt(value)).." dólares.")
	end
end

function sv.depositar(value)
    local source = source
    local user_id = vRP.getUserId(source)
    local identity = vRP.getUserIdentity(user_id)
	if value == nil or value <= 0 or value > vRP.getMoney(user_id) then
        TriggerClientEvent("bank_notify",source,"negado","Valor","Valor inválido")
	else
		vRP.tryDeposit(user_id, tonumber(value))
        setTransferencia(user_id,"Depósito",value)
        TriggerClientEvent("bank_notify",source,"sucesso","Depósito","Você depositou $"..vRP.format(parseInt(value)).." dólares.")
	end
end

function sv.tranferir(id,valor)
    local user_id = vRP.getUserId(source)
	local identity = vRP.getUserIdentity(user_id)

	local nplayer = vRP.getUserSource(parseInt(id))
	local nuser_id = vRP.getUserId(nplayer)
	local identitynu = vRP.getUserIdentity(nuser_id)
	local banco = 0

	if nuser_id == nil then
		TriggerClientEvent("Notify",source,"negado","Passaporte inválido ou indisponível.")
	else
		if nuser_id == user_id then
			TriggerClientEvent("Notify",source,"negado","Você não pode transferir dinheiro para sí mesmo.")	
		else
			local banco = vRP.getBankMoney(user_id)
			local banconu = vRP.getBankMoney(nuser_id)
			
			if banco <= 0 or banco < tonumber(valor) or tonumber(valor) <= 0 then
				TriggerClientEvent("Notify",source,"negado","Dinheiro Insuficiente")
			else
				vRP.setBankMoney(user_id,banco-tonumber(valor))
				vRP.setBankMoney(nuser_id,banconu+tonumber(valor))
                 setTransferencia(user_id,"Transferiu",valor)
                 setTransferencia(nuser_id,"Recebeu",valor)
				TriggerClientEvent("Notify",nplayer,"importante","<b>"..identity.name.." "..identity.firstname.."</b> depositou <b>$"..vRP.format(parseInt(valor)).." dólares</b> na sua conta.")
				TriggerClientEvent("Notify",source,"sucesso","Você transferiu <b>$"..vRP.format(parseInt(valor)).." dólares</b> para conta de <b>"..identitynu.name.." "..identitynu.firstname.."</b>.")
			end
		end
	end
end


--------
--pagar
--------
RegisterCommand('multas',function(source,args,rawCommand)
    local source = source
    local user_id = vRP.getUserId(source)

    local value = vRP.getUData(parseInt(user_id),"vRP:multas")
    local multas = json.decode(value) or 0
    local banco = vRP.getBankMoney(user_id)

    if user_id then
        if args[1] == nil then
            if multas >= 1 then
                TriggerClientEvent("Notify",source,"aviso","Você possuí <b>$"..multas.." dólares em multas</b> para pagar.",8000)
            else
                TriggerClientEvent("Notify",source,"aviso","Você <b>não possuí</b> multas para pagar.",8000)
            end
        elseif args[1] == "pagar" then
            local valorpay = vRP.prompt(source,"Saldo de multas: $"..multas.." - Valor de multas a pagar:","")
            if banco >= parseInt(valorpay) then
                if parseInt(valorpay) <= parseInt(multas) then
                    if string.match(valorpay, "-") then
                        TriggerClientEvent("Notify",source,"negado","Drukas te mandou um abraco.",8000)
                        return false
                    else
                        vRP.setBankMoney(user_id,parseInt(banco-valorpay))
                        vRP.setUData(user_id,"vRP:multas",json.encode(parseInt(multas)-parseInt(valorpay)))
                        TriggerClientEvent("Notify",source,"sucesso","Você pagou <b>$"..valorpay.." dólares</b> em multas.",8000)
                    end
                else
                    TriggerClientEvent("Notify",source,"negado","Você não pode pagar mais multas do que deve.",8000)
                end
            else
                TriggerClientEvent("Notify",source,"negado","Você não tem dinheiro em sua conta suficiente para isso.",8000)
            end
        end
    end
end)

function sv.get_historico_bank()
    local user_id = vRP.getUserId(source)
    local transferencia = json.decode(vRP.query("space/getinfos",{user_id = user_id})[1].transferencia)
    return transferencia
end

function sv.clear_transferencia()
    local user_id = vRP.getUserId(source)
    vRP.execute("space/updatetransferencia",{user_id = user_id, transferencia = "[]"})
end


