run bot-hacking.js ; run bot-gang.js ; run bot-servers.js ; run bot-hacknet.js
kill bot-servers.js ; kill bot-hacknet.js 

buy BruteSSH.exe ;buy FTPCrack.exe ; buy relaySMTP.exe ;buy HTTPWorm.exe ; buy SQLInject.exe
run upgrade-servers.js -b 1; run upgrade-hacknet.js -b 1

kill bot-servers.js -b 1; kill bot-hacknet.js -b 1; kill bot-gang.js -b 1
run bot-servers.js -b 1; run bot-hacknet.js -b 1;run bot-gang.js -b 1