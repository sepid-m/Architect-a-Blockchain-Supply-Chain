App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    upcObtainItem: 0,
    upcFetchItem: 0,
    upcPoulterer: 0,
    upcDairyfactory: 0,
    upcDistributor: 0,
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originFarmerID: "0x0000000000000000000000000000000000000000",
    originFarmName: null,
    originFarmInformation: null,
    originFarmLatitude: null,
    originFarmLongitude: null,
    productNotes: null,
    productPrice: 0,
    dairyfactoryID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",
    roleAddressAccount: "0x0000000000000000000000000000000000000000",
    jsonSupplyChainBuildPath: "",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.sku = $("#sku").val();
        App.upcObtainItem = $("#upcObtainItem").val();
        App.upcFetchItem = $("#upcFetchItem").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originFarmerID = $("#originFarmerID").val();
        App.originFarmName = $("#originFarmName").val();
        App.originFarmInformation = $("#originFarmInformation").val();
        App.originFarmLatitude = $("#originFarmLatitude").val();
        App.originFarmLongitude = $("#originFarmLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.dairyfactoryID = $("#dairyfactoryID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();
        App.roleAddressAccount = $("#roleAccountAddress").val();

        console.log(
            App.sku,
            App.upcObtainItem,
            App.upcFetchItem,
            App.upc,
            App.ownerID, 
            App.originFarmerID, 
            App.originFarmName, 
            App.originFarmInformation, 
            App.originFarmLatitude, 
            App.originFarmLongitude, 
            App.productNotes, 
            App.productPrice, 
            App.dairyfactoryID, 
            App.retailerID, 
            App.consumerID,
            App.roleAddressAccount
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access");
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            console.log('Connected to Ganache Local Network via Web3 direct instance');
        }

        App.getMetaskAccountID();
        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getAccountsID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    setAbiJsonObjectFromNetwork: async function () {
        web3 = new Web3(App.web3Provider);
        await web3.version.getNetwork( (err, netId) => {
            if (err) {
                console.log('Error checking network:',err);
                return;
            }
            console.log('netID:',netId);
            if(netId == 4) {
                console.log('Connected to Rinkeby network');
                App.jsonSupplyChainBuildPath = "../../build-rinkeby/contracts/SupplyChain.json";
            } else {
                console.log('Connected to Ganache network');
                App.jsonSupplyChainBuildPath = "../../build/contracts/SupplyChain.json";
            }

            $.getJSON(App.jsonSupplyChainBuildPath, function(data) {
                console.log('data',data);
                var SupplyChainArtifact = data;
                App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
                App.contracts.SupplyChain.setProvider(App.web3Provider);
                App.fetchEvents();
    
            });
        })
    },

    initSupplyChain: async function () {
        /// Source the truffle compiled smart contracts
        /// JSONfy the smart contracts
        await App.setAbiJsonObjectFromNetwork();

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.addRoleToSupplyChainContract(event);
                break;
            case 2:
                return await App.obtainMilkItem(event);
                break;
            case 3:
                return await App.fetchItemBufferPublic(event);
                break;
            case 4:
                return await App.storeMilkItem(event);
                break;
            case 5:
                return await App.sellItemToDairyfactory(event);
                break;
            case 6:
                return await App.shipItemToDairyFactory(event);
                break;
            case 7:
                return await App.buyItemByDairyfactory(event);
                break;
            case 8:
                return await App.receivedItemByDairyFactory(event);
                break;
            case 9:
                return await App.receivedItemByDairyFactory(event);
                break;
            case 10:
                return await App.processMilkItem(event);
                break;
            case 11:
                return await App.packMilkItem(event);
                break;
            case 12:
                return await App.sellItemToDistributor(event);
                break;
            case 13:
                return await App.shipItemToDistributor(event);
                break;
            case 14:
                return await App.buyItemByDistributor(event);
                break;
            case 15:
                return await App.receiveItemByDistributor(event);
                break;
            }
    },

    // Function to get the owner address
    getOwner: (event) => {
        event.preventDefault();
        const processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.owner.call();
          }).then(function(result) {
            console.log('Owner Address:', result);
          }).catch(function(err) {
            console.log(err.message);
          });
    },

    // Function to add new milk Poulterer/Dairyfactory/Distributor to the SupplyChain contract. Only the owner
    // of the contract can add new addresses to the contract
    addRoleToSupplyChainContract: async (event) => {
        event.preventDefault();
        const processId = parseInt($(event.target).data('id'));
        const roleSelected = $("#rolesSelectBox option").filter(":selected").val();
        // Read the form values
        App.readForm();
        await App.getMetaskAccountID();
        //await App.getOwner(event);
        console.log('Selected role: ' + roleSelected + ' | address: ' + App.roleAddressAccount + ' | metamaskAccount: ' + App.metamaskAccountID);

        if (roleSelected == 'poulterer') {
            App.contracts.SupplyChain.deployed().then(function(instance) {
                return instance.addPoulterer(App.roleAddressAccount, {from: App.metamaskAccountID});
            }).then(function(result) {
                $("#ftc-item").text(result);
                console.log('Added poulterer role to SupplyChain Contract',result);
            }).catch(function(err) {
                console.log(err.message);
            });
        } else if (roleSelected == 'dairyfactory') {
            App.contracts.SupplyChain.deployed().then(function(instance) {
                return instance.addDairyfactory(App.roleAddressAccount, {from: App.metamaskAccountID});
            }).then(function(result) {
                $("#ftc-item").text(result);
                console.log('Added dairyfactory role to SupplyChain Contract',result);
            }).catch(function(err) {
                console.log(err.message);
            });
        } else {
            App.contracts.SupplyChain.deployed().then(function(instance) {
                return instance.addDistributor(App.roleAddressAccount, {from: App.metamaskAccountID});
            }).then(function(result) {
                $("#ftc-item").text(result);
                console.log('Added distributor role to SupplyChain Contract',result);
            }).catch(function(err) {
                console.log(err.message);
            });
        }
    },

    // Function to obtain milk. At this point the poulterer will add an asset item to the SupplyChain contract
    obtainMilkItem: async (event) => {
        event.preventDefault();
        // Read the form values
        App.readForm();
        await App.getMetaskAccountID();

        //$('.custom-file-label').file_upload();
        
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.obtainItem(
                App.upcObtainItem, 
                App.metamaskAccountID, 
                App.originFarmName, 
                App.originFarmInformation, 
                App.originFarmLatitude, 
                App.originFarmLongitude, 
                App.productNotes,
                {from: App.metamaskAccountID}
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('harvestItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    // Function to fetch data
    fetchItemBufferPublic: () => {
        //event.preventDefault();
        App.upc = $('#upcFetchItem').val();
        console.log('UPC', App.upc);
        // Hide the alert in case open
        $('#fetch-data-not-found').hide();
    
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.fetchItemBufferPublic(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            // Display table with data
            document.getElementById('result-upc').innerText = result[1];
            document.getElementById('result-sku').innerText = result[0];
            document.getElementById('result-owner-id').innerText = result[2];
            document.getElementById('result-poulterer-id').innerText = result[3];
            document.getElementById('result-poulterer-name').innerText = result[4];
            document.getElementById('result-item-state').innerText = App.helperMappingStateCodeToString(result[8]);
            document.getElementById('result-price').innerText = web3.fromWei(result[9], 'ether');
            document.getElementById('result-distributor-id').innerText = result[10];
            $('#search-table').show();
            $('#search-table').fadeIn();
            $('#search-table').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('fetchItemBufferPublic', result);
        }).catch(function(err) {
            console.log(err.message);
            $('#search-table').hide();
            $('#fetch-data-not-found').show();
            $('#fetch-data-not-found').fadeIn();
            $('#fetch-data-not-found').slideDown();
        });
    },

    // Function to store milk. Only poulterer can process items
    storeMilkItem: async (event) => {
        event.preventDefault();
        // Read the form values
        App.upc = $('#upcPoultererChangeState').val();
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-poulterer-error').hide();
        $('#alert-poulterer-success').hide();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.storeItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#alert-poulterer-success").text("Item stored");
            $('#alert-poulterer-success').show();
            $('#alert-poulterer-success').fadeIn();
            $('#alert-poulterer-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Store milk', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-poulterer-error").text("Error by store milk item. Please contact the administrator.");
            $('#alert-poulterer-error').show();
            $('#alert-poulterer-error').fadeIn();
            $('#alert-poulterer-error').slideDown();
        });
    },

    // Function to sell milk to dairyfactory. Only Poulterer can sell milk to dairyfactory
    sellItemToDairyfactory: async (event) => {
        event.preventDefault();
        // Read the form values
        App.upc = $('#upcPoultererChangeState').val();
        App.productPrice = $('#pricePoulterer').val();
        const price= web3.toWei(App.productPrice, "ether");
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-poulterer-error').hide();
        $('#alert-poulterer-success').hide();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.sellToDairyfactory(App.upc, price, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#alert-poulterer-success").text("Item ready to sell to dairyfactory");
            $('#alert-poulterer-success').show();
            $('#alert-poulterer-success').fadeIn();
            $('#alert-poulterer-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Sell item to dairyfactory', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-poulterer-error").text("Error by sell item. Please contact the administrator.");
            $('#alert-poulterer-error').show();
            $('#alert-poulterer-error').fadeIn();
            $('#alert-poulterer-error').slideDown();
        });
    },

    // Function to buy milk by dairyfactory. Only Dairyfactory can buy milk from poulterer
    buyItemByDairyfactory: async (event) => {
        event.preventDefault();
        // Read the form values
        App.upc = $('#upcDairyfactoryChangeState').val();
        App.productPrice = $('#priceDairyfactory').val();
        const price= web3.toWei(App.productPrice, "ether");
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-dairyfactory-error').hide();
        $('#alert-dairyfactory-success').hide();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.buyItemByDairyfactory(App.upc, {from: App.metamaskAccountID, value: price});
        }).then(function(result) {
            $("#alert-dairyfactory-success").text("Item successfully sold");
            $('#alert-dairyfactory-success').show();
            $('#alert-dairyfactory-success').fadeIn();
            $('#alert-dairyfactory-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Sell item to dairyfactory', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-dairyfactory-error").text("Error by buying item. Please contact the administrator.");
            $('#alert-dairyfactory-error').show();
            $('#alert-dairyfactory-error').fadeIn();
            $('#alert-dairyfactory-error').slideDown();
        });
    },

    // Function to ship milk to dairyfactory. Only Poulterer can ship milk to dairyfactory
    shipItemToDairyFactory: async (event) => {
        event.preventDefault();
        // Read the form values
        App.upc = $('#upcPoultererChangeState').val();
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-poulterer-error').hide();
        $('#alert-poulterer-success').hide();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.shipItemToDairyfactory(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#alert-poulterer-success").text("Item shipped");
            $('#alert-poulterer-success').show();
            $('#alert-poulterer-success').fadeIn();
            $('#alert-poulterer-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Ship item', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-poulterer-error").text("Error by ship item. Please contact the administrator.");
            $('#alert-poulterer-error').show();
            $('#alert-poulterer-error').fadeIn();
            $('#alert-poulterer-error').slideDown();
        });
    },

    // Function to dairyfactory receive milk. Only dairyfactory can receive milk from poulterer
    receivedItemByDairyFactory: async (event) => {
        event.preventDefault();
        // Read the form values
        App.upc = $('#upcDairyfactoryChangeState').val();
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-dairyfactory-error').hide();
        $('#alert-dairyfactory-success').hide();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveItemByDairyfactory(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#alert-dairyfactory-success").text("Item successfully received");
            $('#alert-dairyfactory-success').show();
            $('#alert-dairyfactory-success').fadeIn();
            $('#alert-dairyfactory-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Sell item to dairyfactory', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-dairyfactory-error").text("Error by receiving item. Please contact the administrator.");
            $('#alert-dairyfactory-error').show();
            $('#alert-dairyfactory-error').fadeIn();
            $('#alert-dairyfactory-error').slideDown();
        });
    },

    // Function to test milk by dairyfactory. Only dairyfactory can test milk.
    testMilkItem: async (event) => {
        event.preventDefault();
        // Read the form values
        App.upc = $('#upcDairyfactoryChangeState').val();
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-dairyfactory-error').hide();
        $('#alert-dairyfactory-success').hide();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.sellItemToDairyfactory(App.upc, {from: App.metamaskAccountID, value: true});
        }).then(function(result) {
            $("#alert-dairyfactory-success").text("Item tested and qualified");
            $('#alert-dairyfactory-success').show();
            $('#alert-dairyfactory-success').fadeIn();
            $('#alert-dairyfactory-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Test item', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-dairyfactory-error").text("Error by test item. Please contact the administrator.");
            $('#alert-dairyfactory-error').show();
            $('#alert-dairyfactory-error').fadeIn();
            $('#alert-dairyfactory-error').slideDown();
        });
    },

    // Function to process milk by dairyfactory. Only dairyfactory can process milk.
    processMilkItem: async (event) => {
        event.preventDefault();
        // Read the form values
        App.upc = $('#upcDairyfactoryChangeState').val();
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-dairyfactory-error').hide();
        $('#alert-dairyfactory-success').hide();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.processMilk(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#alert-dairyfactory-success").text("Item successfully processed");
            $('#alert-dairyfactory-success').show();
            $('#alert-dairyfactory-success').fadeIn();
            $('#alert-dairyfactory-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Process Milk', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-dairyfactory-error").text("Error by processing item. Please contact the administrator.");
            $('#alert-dairyfactory-error').show();
            $('#alert-dairyfactory-error').fadeIn();
            $('#alert-dairyfactory-error').slideDown();
        });
    },

    // Function to pack milk by dairyfactory. Only dairyfactory can pack milk.
    packMilkItem: async (event) => {
        event.preventDefault();
        // Read the form values
        App.upc = $('#upcDairyfactoryChangeState').val();
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-dairyfactory-error').hide();
        $('#alert-dairyfactory-success').hide();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.packMilk(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#alert-dairyfactory-success").text("Item successfully packed");
            $('#alert-dairyfactory-success').show();
            $('#alert-dairyfactory-success').fadeIn();
            $('#alert-dairyfactory-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Pack Milk', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-dairyfactory-error").text("Error by packing item. Please contact the administrator.");
            $('#alert-dairyfactory-error').show();
            $('#alert-dairyfactory-error').fadeIn();
            $('#alert-dairyfactory-error').slideDown();
        });
    },

    // Function to sell milk to distributor. Only Dairyfactory can sell milk to distributor
    sellItemToDistributor: async (event) => {
        event.preventDefault();
        // Read the form values
        App.upc = $('#upcDairyfactoryChangeState').val();
        App.productPrice = $('#priceDistributor').val();
        const price= web3.toWei(App.productPrice, "ether");
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-dairyfactory-error').hide();
        $('#alert-dairyfactory-success').hide();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.sellToDistributor(App.upc, price, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#alert-dairyfactory-success").text("Item ready for sell");
            $('#alert-dairyfactory-success').show();
            $('#alert-dairyfactory-success').fadeIn();
            $('#alert-dairyfactory-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Sell item to dairyfactory', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-dairyfactory-error").text("Error by selling item. Please contact the administrator.");
            $('#alert-dairyfactory-error').show();
            $('#alert-dairyfactory-error').fadeIn();
            $('#alert-dairyfactory-error').slideDown();
        });
    },

    // Function to buy milk by distributor. Only distributor can buy milk from dairyfactory
    buyItemByDistributor: async (event) => {
        event.preventDefault();
        // Read the form values
        App.upc = $('#upcDistributorChangeState').val();
        App.productPrice = $('#priceDistributor').val();
        const price= web3.toWei(App.productPrice, "ether");
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-distributor-error').hide();
        $('#alert alert-success').hide();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.buyItemByDistributor(App.upc, {from: App.metamaskAccountID, value: price});
        }).then(function(result) {
            $("#alert alert-success").text("Item successfully sold");
            $('#alert alert-success').show();
            $('#alert alert-success').fadeIn();
            $('#alert alert-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Sell item to distributor', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-distributor-error").text("Error by buying item. Please contact the administrator.");
            $('#alert-distributor-error').show();
            $('#alert-distributor-error').fadeIn();
            $('#alert-distributor-error').slideDown();
        });
    },

    // Function to ship milk to distributor. Only dairyfactory can ship milk to distributor
    shipItemToDistributor: async (event) => {
        event.preventDefault();
        // Read the form values
        App.upc = $('#upcDairyfactoryChangeState').val();
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-dairyfactory-error').hide();
        $('#alert-dairyfactory-success').hide();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.shipItemToDistributor(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#alert-dairyfactory-success").text("Item successfully shipped");
            $('#alert-dairyfactory-success').show();
            $('#alert-dairyfactory-success').fadeIn();
            $('#alert-dairyfactory-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Sell item to distributor', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-dairyfactory-error").text("Error by shipping item. Please contact the administrator.");
            $('#alert-dairyfactory-error').show();
            $('#alert-dairyfactory-error').fadeIn();
            $('#alert-dairyfactory-error').slideDown();
        });
    },

    // Function to receive milk. Only distributor can receive milk from dairyfactory
    receiveItemByDistributor: async (event) => {
        event.preventDefault();
        // Read the form values
        App.upc = $('#upcDistributorChangeState').val();
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-distributor-error').hide();
        $('#alert alert-success').hide();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveItemByDistributor(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#alert alert-success").text("Item successfully received");
            $('#alert alert-success').show();
            $('#alert alert-success').fadeIn();
            $('#alert alert-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Sell item to distributor', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-distributor-error").text("Error by receiving item. Please contact the administrator.");
            $('#alert-distributor-error').show();
            $('#alert-distributor-error').fadeIn();
            $('#alert-distributor-error').slideDown();
        });
    },

    helperMappingStateCodeToString: (stateCode) => {
        console.log(stateCode.c[0]);
        let stateString = '';
        if (stateCode.c[0] == 0) {
            stateString = 'Obtained';
        } else if (stateCode.c[0] == 1) {
            stateString = 'Stored';
        } else if (stateCode.c[0] == 2) {
            stateString = 'ForSaleToDairyfactory';
        } else if (stateCode.c[0] == 3) {
            stateString = 'SoldToDairyfactory';
        } else if (stateCode.c[0] == 4) {
            stateString = 'ShippedToDairyfactory';
        } else if (stateCode.c[0] == 5) {
            stateString = 'ReceivedByDairyfactory';
        } else if (stateCode.c[0] == 6) {
            stateString = 'Tested';
        } else if (stateCode.c[0] == 7) {
            stateString = 'Qualified';
        } else if (stateCode.c[0] == 8) {
            stateString = 'Failed';
        } else if (stateCode.c[0] == 9) {
            stateString = 'Processed';
        } else if (stateCode.c[0] == 10) {
            stateString = 'Returned';
        } else if (stateCode.c[0] == 11) {
            stateString = 'Retaken';
        } else if (stateCode.c[0] == 12) {
            stateString = 'ShippedToPoulterer';
        } else if (stateCode.c[0] == 13) {
            stateString = 'ReceivedByPoulterer';
        } else if (stateCode.c[0] == 14) {
            stateString = 'Destroyed';
        } else if (stateCode.c[0] == 15) {
            stateString = 'Packed';
        } else if (stateCode.c[0] == 16) {
            stateString = 'ForSaleToDistributor';
        } else if (stateCode.c[0] == 17) {
            stateString = 'SoldToDistributor';
        } else if (stateCode.c[0] == 18) {
            stateString = 'ShippedToDistributor';
        } else if (stateCode.c[0] == 19) {
            stateString = 'ReceivedByDistributor';
        } else if (stateCode.c[0] == 20) {
            stateString = 'ForSaleToRetailer';
        } else if (stateCode.c[0] == 21) {
            stateString = 'SoldToRetailer';
        } else if (stateCode.c[0] == 22) {
            stateString = 'ShippedToRetailer';
        } else if (stateCode.c[0] == 23) {
            stateString = 'ReceivedByRetailer';
        } else if (stateCode.c[0] == 24) {
            stateString = 'ForSaleToSupermarket';
        } else if (stateCode.c[0] == 25) {
            stateString = 'SoldToSupermarket';
        } else if (stateCode.c[0] == 26) {
            stateString = 'ShippedToSupermarket';
        } else if (stateCode.c[0] == 27) {
            stateString = 'RecievedBySupermarket';
        } else if (stateCode.c[0] == 28) {
            stateString = 'ForSaleToConsumer';
        } else if (stateCode.c[0] == 29) {
            stateString = 'SoldToConsumer';
        } else if (stateCode.c[0] == 30) {
            stateString = 'PurchasedByConsumer';
        }
        return stateString;
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
            var events = instance.allEvents(function(err, log){
                if (!err)
                    $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
            });
        }).catch(function(err) {
          console.log('Error in fetch events:', err.message);
        });
        
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
