import Web3 from "web3";
import SupplyChainArtifact from "../../build/contracts/SupplyChain.json";

const App = {
    web3: null,
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    metamaskAccountID: "0x0000000000000000000000000000000000000000",

    currentItemExists: false,
    currentProductState: -1,

    init: async function () {
        // Setup UI

        $('.tabs').tabs();

        /// Setup access to blockchain
        return await App.initWeb3();
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            App.web3 = new Web3(window.ethereum);
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
            App.web3 = new Web3(App.web3Provider);
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            App.web3 = new Web3(App.web3Provider);
        }

        await App.getMetaskAccountID();

        App.networkId = await App.web3.eth.net.getId();
        App.deployedNetwork = SupplyChainArtifact.networks[App.networkId];

        return App.initSupplyChain();
    },

    getMetaskAccountID: async function () {
        // Retrieving accounts
        await App.web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

            $("#user_address").val(App.metamaskAccountID);
            M.updateTextFields();
        });
    },

    initSupplyChain: function () {
        App.contracts.SupplyChain = new App.web3.eth.Contract(
            SupplyChainArtifact.abi,
            App.deployedNetwork.address,
        );
        App.contracts.SupplyChain.setProvider(App.web3Provider);

        App.fetchItemBufferOne();
        App.fetchItemBufferTwo();
        App.fetchEvents();
        App.fetchRoles();

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);

        $("#role_farmer").on("change", (event) => {
            const { addFarmer, renounceFarmer } = App.contracts.SupplyChain.methods;

            if ($('#role_farmer').is(':checked')) {
                addFarmer(
                    App.metamaskAccountID
                ).send({from: App.metamaskAccountID}).then(function (result) {
                    App.fetchRoles();
                    console.log('addFarmer', result);
                }).catch(function (err) {
                    console.log(err.message);
                });
            } else {
                renounceFarmer().send({from: App.metamaskAccountID}).then(function (result) {
                    App.fetchRoles();
                    console.log('addFarmer', result);
                }).catch(function (err) {
                    console.log(err.message);
                });
            }
        });


        $("#role_distributor").on("change", (event) => {
            const { addDistributor, renounceDistributor } = App.contracts.SupplyChain.methods;

            if ($('#role_distributor').is(':checked')) {
                addDistributor(
                    App.metamaskAccountID
                ).send({from: App.metamaskAccountID}).then(function (result) {
                    App.fetchRoles();
                }).catch(function (err) {
                    console.log(err.message);
                });
            } else {
                renounceDistributor().send({from: App.metamaskAccountID}).then(function (result) {
                    App.fetchRoles();
                }).catch(function (err) {
                    console.log(err.message);
                });
            }
        });


        $("#role_retailer").on("change", (event) => {
            const { addRetailer, renounceRetailer } = App.contracts.SupplyChain.methods;

            if ($('#role_retailer').is(':checked')) {
                addRetailer(
                    App.metamaskAccountID
                ).send({from: App.metamaskAccountID}).then(function (result) {
                    App.fetchRoles();
                }).catch(function (err) {
                    console.log(err.message);
                });
            } else {
                renounceRetailer().send({from: App.metamaskAccountID}).then(function (result) {
                    App.fetchRoles();
                }).catch(function (err) {
                    console.log(err.message);
                });
            }
        });


        $("#role_consumer").on("change", (event) => {
            const { addConsumer, renounceConsumer } = App.contracts.SupplyChain.methods;

            if ($('#role_consumer').is(':checked')) {
                addConsumer(
                    App.metamaskAccountID
                ).send({from: App.metamaskAccountID}).then(function (result) {
                    App.fetchRoles();
                }).catch(function (err) {
                    console.log(err.message);
                });
            } else {
                renounceConsumer().send({from: App.metamaskAccountID}).then(function (result) {
                    App.fetchRoles();
                }).catch(function (err) {
                    console.log(err.message);
                });
            }
        });

        $("#harvest_button").on("click", (event) => {
            event.preventDefault();

            const { harvestItem } = App.contracts.SupplyChain.methods;

            const _upc = $("#upc").val();
            const originFarmerID = App.metamaskAccountID;
            const originFarmName = $("#harvest_origin_farm_name").val();
            const originFarmInformation = $("#harvest_origin_farm_information").val();
            const originFarmLatitude = $("#harvest_origin_farm_latitude").val();
            const originFarmLongitude = $("#harvest_origin_farm_longitude").val();
            const productNotes = $("#harvest_origin_product_notes").val();

            harvestItem(_upc, originFarmerID, originFarmName,
                originFarmInformation, originFarmLatitude, originFarmLongitude,
                productNotes).send({from: App.metamaskAccountID}).then(function (result) {
                App.updateApp();
            }).catch(function (err) {
                console.log(err.message);
            });
        });

        $("#process_button").on("click", (event) => {
            event.preventDefault();

            const { processItem } = App.contracts.SupplyChain.methods;

            const _upc = $("#upc").val();

            processItem(_upc).send({from: App.metamaskAccountID}).then(function (result) {
                App.updateApp();
            }).catch(function (err) {
                console.log(err.message);
            });
        });

        $("#pack_button").on("click", (event) => {
            event.preventDefault();

            const { packItem } = App.contracts.SupplyChain.methods;

            const _upc = $("#upc").val();

            packItem(_upc).send({from: App.metamaskAccountID}).then(function (result) {
                App.updateApp();
            }).catch(function (err) {
                console.log(err.message);
            });
        });

        $("#sell_button").on("click", (event) => {
            event.preventDefault();

            const { sellItem } = App.contracts.SupplyChain.methods;

            const _upc = $("#upc").val();
            const price = $("#sell_product_price").val();

            sellItem(_upc, price).send({from: App.metamaskAccountID}).then(function (result) {
                App.updateApp();
            }).catch(function (err) {
                console.log(err.message);
            });
        });

        $("#buy_button").on("click", (event) => {
            event.preventDefault();

            const { buyItem } = App.contracts.SupplyChain.methods;

            const _upc = $("#upc").val();
            const price = $("#product_price").val();
            console.log(price);

            buyItem(_upc).send({from: App.metamaskAccountID, value: price}).then(function (result) {
                App.updateApp();
            }).catch(function (err) {
                console.log(err.message);
            });
        });

        $("#ship_button").on("click", (event) => {
            event.preventDefault();

            const { shipItem } = App.contracts.SupplyChain.methods;

            const _upc = $("#upc").val();

            shipItem(_upc).send({from: App.metamaskAccountID}).then(function (result) {
                App.updateApp();
            }).catch(function (err) {
                console.log(err.message);
            });
        });

        $("#receive_button").on("click", (event) => {
            event.preventDefault();

            const { receiveItem } = App.contracts.SupplyChain.methods;

            const _upc = $("#upc").val();

            receiveItem(_upc).send({from: App.metamaskAccountID}).then(function (result) {
                App.updateApp();
            }).catch(function (err) {
                console.log(err.message);
            });
        });

        $("#purchase_button").on("click", (event) => {
            event.preventDefault();

            const { purchaseItem } = App.contracts.SupplyChain.methods;

            const _upc = $("#upc").val();

            purchaseItem(_upc).send({from: App.metamaskAccountID}).then(function (result) {
                App.updateApp();
            }).catch(function (err) {
                console.log(err.message);
            });
        });
    },

    handleButtonClick: async function(event) {

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        App.updateApp();
    },

    updateApp: function() {
        App.fetchItemBufferOne();
        App.fetchItemBufferTwo();
        App.fetchRoles();
        App.fetchEvents();
    },

    fetchItemBufferOne: function () {
        App.upc = $('#upc').val();
        console.log('upc',App.upc);

        const { fetchItemBufferOne } = App.contracts.SupplyChain.methods;

        fetchItemBufferOne(App.upc).call().then(function(result) {
            $("#owner_id").val(result.ownerID);
            $("#origin_farmer_id").val(result.originFarmerID);
            $("#origin_farm_name").val(result.originFarmName);
            $("#origin_farm_latitude").val(result.originFarmLatitude);
            $("#origin_farm_longitude").val(result.originFarmLongitude);

            M.updateTextFields();

            App.currentItemExists = result.ownerID !== App.emptyAddress;

            App.updateActionsUI();

            console.log('fetchItemBufferOne', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchItemBufferTwo: function () {
        const { fetchItemBufferTwo } = App.contracts.SupplyChain.methods;

        fetchItemBufferTwo(App.upc).call().then(function(result) {

            $("#product_id").val(result.productID);
            $("#product_notes").val(result.productNotes);
            $("#product_price").val(result.productPrice);
            $("#item_state").val(result.itemState);

            $("#distributer_id").val(result.distributorID);
            $("#retailer_id").val(result.retailerID);
            $("#consumer_id").val(result.consumerID);

            App.currentProductState = result.itemState;

            App.updateActionsUI();

            M.updateTextFields();

            console.log('fetchItemBufferTwo', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchRoles: function() {
        const { isFarmer, isConsumer, isDistributor, isRetailer } = App.contracts.SupplyChain.methods;
        console.log(App.contracts.SupplyChain.methods);

        Promise.all([
            isFarmer(App.metamaskAccountID).call(),
            isConsumer(App.metamaskAccountID).call(),
            isDistributor(App.metamaskAccountID).call(),
            isRetailer(App.metamaskAccountID).call()
        ]).then(function(results) {
            $('#role_farmer').prop('checked', results[0]);
            $('#role_consumer').prop('checked', results[1]);
            $('#role_distributor').prop('checked', results[2]);
            $('#role_retailer').prop('checked', results[3]);

            M.updateTextFields();

            App.updateActionsUI();

            console.log('fetchRoles', results);
        }).catch(function(err) {
            console.log(err.message);
        });
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

        App.contracts.SupplyChain.events.allEvents(function(err, log){
            //if (!err)
                //$("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });

    },

    updateActionsUI: function () {
        $("#no_farmer_info").hide();
        $("#no_distributor_info").hide();
        $("#no_retailer_info").hide();
        $("#no_consumer_info").hide();

        $("#harvest_form").hide();
        $("#process_form").hide();
        $("#pack_form").hide();
        $("#sell_form").hide();
        $("#buy_form").hide();
        $("#ship_form").hide();
        $("#receive_form").hide();
        $("#purchase_form").hide();

        $("#farmer_done_form").hide();
        $("#distributor_done_form").hide();
        $("#retailer_done_form").hide();
        $("#consumer_done_form").hide();

        if ($('#role_farmer').is(':checked')) {
            // Farmer
            if (!App.currentItemExists) {
                $("#harvest_form").show();
            } else {
                if (App.currentProductState == 0) {
                    $("#process_form").show();
                } else if (App.currentProductState == 1) {
                    $("#pack_form").show();
                } else if (App.currentProductState == 2) {
                    $("#sell_form").show();
                }

                if (App.currentProductState > 2) {
                    $("#farmer_done_form").show();
                }
            }
        } else {
            $("#no_farmer_info").show();
        }

        if ($('#role_distributor').is(':checked')) {
            if (App.currentProductState == 3) {
                $("#buy_form").show();
            }

            if (App.currentProductState == 4) {
                $("#ship_form").show();
            }

            if (App.currentProductState > 4) {
                $("#distributor_done_form").show();
            }
        } else {
            $("#no_distributor_info").show();
        }

        if ($('#role_retailer').is(':checked')) {
            if (App.currentProductState == 5) {
                $("#receive_form").show();
            }

            if (App.currentProductState > 5) {
                $("#retailer_done_form").show();
            }
        } else {
            $("#no_retailer_info").show();
        }

        if ($('#role_consumer').is(':checked')) {
            if (App.currentProductState == 6) {
                $("#purchase_form").show();
            }

            if (App.currentProductState > 6) {
                $("#consumer_done_form").show();
            }
        } else {
            $("#no_consumer_info").show();
        }
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
