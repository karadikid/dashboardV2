let TokenContract;
let SablierContract;
let LibertasContract;
let LibertasPostsContract;
let Biconomy = window.Biconomy;
let biconomy;

window.addEventListener('load', async () => {

    if (window.web3) {

        web3.version.getNetwork((err, netId) => {
            if(netId != 80001){
                alert("Please switch to https://rpc-mumbai.matic.today");
            }
        });


        try {
            let options = {
                apiKey: 'WV-l7YQaN.72e99dd9-0411-48e5-ba15-683e6f8a4e30',
                strictMode: false,
                debug: true
            };

            biconomy = new Biconomy(web3.currentProvider, options);
            window.web3 = new Web3(biconomy);

            TokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
            SablierContract = new web3.eth.Contract(sablierABI, sablierAddress);
            LibertasContract = new web3.eth.Contract(libertasABI, libertasAddress);
            FaucetContract = new web3.eth.Contract(faucetABI, faucetAddress);

            biconomy.onEvent(biconomy.READY, async () => {
                console.table(biconomy.dappAPIMap);
                init();
            }).onEvent(biconomy.ERROR, (error, message) => {
                console.log("Mexa Error", error);
            });

        } catch (error) {
            console.log(error);
            alert(error);

        }

    } else{
        alert("Get MetaMask");
    }
});

async function requireLogin(){
    await web3.currentProvider.enable();

    if(!biconomy.isLogin) {
        await biconomyLogin();
    }
}

async function biconomyLogin(){
	let promise = new Promise(async (res, rej) => {

		try{

            let userAddress = await web3.eth.getAccounts().then((data)=>{return data[0]});
			biconomy.login(userAddress, (error, response) => {
				if(response.userContract) {
					console.log("Existing User Contract: " + response.userContract);
					res(true);
				} else if(response.transactionHash) {
					console.log("New User");
					res(true);
				}
			});

		 } catch(error) {
			console.log(`Error Code: ${error.code} Error Message: ${error.message}`);
			rej(false);
		 }

    });
	let result = await promise;
    console.log(result);
    return result;
}

function getParameterByName(name) {
    url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const ipfsServerList = [
    'https://ipfs.io/ipfs/',
    'https://ipfs.infura.io/ipfs/',
    'https://gateway.ipfs.io/ipfs/',
    'https://ipfs.fleek.co/ipfs/',
    'https://ninetailed.ninja/ipfs/',
	'https://ipfs.oceanprotocol.com/ipfs/'
]

const ipfsLink = _ipfsHash => {
    return _ipfsHash == '' ? './assets/notfound.png' : `${ipfsServerList[0]}${_ipfsHash}`;
}

const ipfsLinks = _ipfsHash => {
    let links = [];
    for (var i = 0, len = ipfsServerList.length; i < len; i++) {
        links.push(_ipfsHash == '' ? './assets/notfound.png' : `${ipfsServerList[i]}${_ipfsHash}`)
    }
    return links;
}

const withHttps = url => !/^https?:\/\//i.test(url) ? `https://${url}` : url;

const catMapping = {
    1:'Technology',
    2:'Entertainment',
    3:'Design',
    4:'Ethereum',
}
const catToText = id => id > 0 && id < Object.keys(catMapping).length ? catMapping[id] : 'Invalid Cat';


function prettyDate (dateFuture){
    var dateNow = Date.now();

    var seconds = Math.floor((dateNow - dateFuture)/1000);
    var minutes = Math.floor(seconds/60);
    var hours = Math.floor(minutes/60);
    var days = Math.floor(hours/24);

    hours = hours-(days*24);
    minutes = minutes-(days*24*60)-(hours*60);
    seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);

    let st1 = days>0? `${days}d` : '';
    let st2 = hours>0? `${hours}h` : '';
    let st3 = minutes>0? `${minutes}m` : '';
    let st4 = seconds>0? `${seconds}s` : '';
    return `${st1} ${st2} ${st3} ${st4} ago`;
}


function prettySize(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function validHeader(_url) {
    return fetch(_url, {method: 'HEAD', mode: 'no-cors'})
    .then((response) => {return true})
    .catch((e)=>{return false});
}


function trimAddress(_add, l=3) {
    return _add.slice(0, 2+l) +'...' +_add.slice(_add.length-l);
}

function arrSum(arr){
    total = 0;
    arr.forEach(function(key){
        total = total + key;
    });
    return total;
}