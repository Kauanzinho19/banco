fx_version "cerulean"
game {"gta5"}

ui_page "nui/index.html"

server_scripts {
    "@vrp/lib/utils.lua",
	'server_config.lua',
    'server.lua',
}

client_scripts  {
	"@vrp/lib/utils.lua",
	'config.lua',
    "client.lua",
}

files {
	"nui/*",
	"nui/**/*",
	"nui/**/**/*",
}              