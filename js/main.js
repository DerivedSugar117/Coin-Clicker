var game = {
    coins: 0,
    totalCoins: 0,
    totalClicks: 0,
    clickValue: 1,
    version: 0.000,

    addToCoins: function (amount) {
        this.coins += amount;
        this.totalCoins += amount;
        display.updateCoins();
    },

    getCoinsPerSecond: function () {
        var coinsPerSecond = 0;
        for (i = 0; i < building.name.length; i++) {
            coinsPerSecond += building.income[i] * building.count[i];
        }
        return coinsPerSecond;
    }
};

var building = {
    name: [
        "Miner",
        "Boss",
        "Mayor"
    ],
    image: [
        "miner.jpg",
        "boss.jpg",
        "mayor.png"
    ],
    count: [0, 0, 0],
    income: [
        1,
        15,
        155
    ],
    cost: [
        20,
        150,
        1000
    ],

    purchase: function (index) {
        if (game.coins >= this.cost[index]) {
            game.coins -= this.cost[index];
            this.count[index]++;
            this.cost[index] = Math.ceil(this.cost[index] * 1.3);
            display.updateCoins();
            display.updateShop();
            display.updateUpgrades();
        }
    }
};

var upgrade = {
    name: [
        "Stone Miners",
        "Stone Clicker"
    ],
    description: [
        "Miners become 2x more effective",
        "Clicks become 2x more powerful"
    ],
    image: [
        "stoneminer.png",
        "stonecursor.png"
    ],
    type: [
        "building",
        "click"
    ],
    cost: [
        300,
        500
    ],
    buildingIndex: [
        0,
        -1
    ],
    requirement: [
        1,
        3
    ],
    bonus: [
        2,
        2
    ],
    purchased: [false,false],

    purchase: function (index) {
        if (!this.purchased[index] && game.coins >= this.cost[index]) {
            if (this.type[index] == "building" && building.count[this.buildingIndex[index]] >= this.requirement[index]) {
                game.coins -= this.cost[index];
                building.income[this.buildingIndex[index]] *= this.bonus[index];
                this.purchased[index] = true;

                display.updateUpgrades();
                display.updateCoins();
            } else if (this.type[index] == "click" && game.totalClicks >= this.requirement[index]) {
                game.coins -= this.cost[index];
                game.clickValue *= this.bonus[index];
                this.purchased[index] = true;

                display.updateUpgrades();
                display.updateCoins();
            }
        }
    }
};

var display = {
    updateCoins: function () {
        document.getElementById("coins").innerHTML = game.coins;
        document.getElementById("coinspersecond").innerHTML = game.getCoinsPerSecond();
        document.title = game.coins + " coins - Coin CLicker";
    },

    updateShop: function () {
        document.getElementById("shopContainer").innerHTML = "";
        for (i = 0; i < building.name.length; i++) {
            document.getElementById("shopContainer").innerHTML += '<table class="shopButton unselectable" onclick="building.purchase(' + i + ')"><tr><td id="image"><img src="images/' + building.image[i] + '"></td><td id="nameAndCost"><p>' + building.name[i] + '</p><p><span>' + building.cost[i] + '</span> Coins</p></td><td id="amount"><span>' + building.count[i] + '</span></td></tr></table>'
        }
    },


    updateUpgrades: function () {
        document.getElementById("upgradeContainer").innerHTML = "";
        for (i = 0; i < upgrade.name.length; i++) {
            if (!upgrade.purchased[i]) {
                if (upgrade.type[i] == "building" && building.count[upgrade.buildingIndex[i]] >= upgrade.requirement[i]) {
                    document.getElementById("upgradeContainer").innerHTML += '<img src="images/' + upgrade.image[i] + '" title="' + upgrade.name[i] + ' &#10; ' + upgrade.description[i] + ' &#10; (' + upgrade.cost[i] + ' coins)" onclick="upgrade.purchase(' + i + ')">';
                } else if (upgrade.type[i] == "click" && game.totalClicks >= upgrade.requirement[i]) {
                    document.getElementById("upgradeContainer").innerHTML += '<img src="images/' + upgrade.image[i] + '" title="' + upgrade.name[i] + ' &#10; ' + upgrade.description[i] + ' &#10; (' + upgrade.cost[i] + ' coins)" onclick="upgrade.purchase(' + i + ')">';
                }
            }
        }
    }
};

function saveGame() {
    var gameSave = {
        coins: game.coins,
        totalCoins: game.totalCoins,
        totalClicks: game.totalClicks,
        clickValue: game.clickValue,
        version: game.version,
        buildingCount: building.count,
        buildingIncome: building.income,
        buildingCost: building.cost,
        upgradePurchased: upgrade.purchased
    };
    localStorage.setItem("gameSave", JSON.stringify(gameSave));
}

function loadGame() {
    var savedGame = JSON.parse(localStorage.getItem("gameSave"));
    if (localStorage.getItem("gameSave") !== null) {
        if (typeof savedGame.coins !== "undefined") game.coins = savedGame.coins;
        if (typeof savedGame.totalCoins !== "undefined") game.totalCoins = savedGame.totalCoins;
        if (typeof savedGame.totalClicks !== "undefined") game.totalClicks = savedGame.totalClicks;
        if (typeof savedGame.clickValue !== "undefined") game.clickValue = savedGame.clickValue;
        if (typeof savedGame.buildingCount !== "undefined") {
            for (i = 0; i < savedGame.buildingCount.length; i++) {
                building.count[i] = savedGame.buildingCount[i];
            }
        }
        if (typeof savedGame.buildingIncome !== "undefined") {
            for (i = 0; i < savedGame.buildingIncome.length; i++) {
                building.income[i] = savedGame.buildingIncome[i];
            }
        }
        if (typeof savedGame.buildingCost !== "undefined") {
            for (i = 0; i < savedGame.buildingCost.length; i++) {
                building.cost[i] = savedGame.buildingCost[i];
            }
        }
        if (typeof savedGame.upgradePurchased !== "undefined") {
            for (i = 0; i < savedGame.upgradePurchased.length; i++) {
                upgrade.purchased[i] = savedGame.upgradePurchased[i];
            }
        }
    }
}
function resetGame() {
    if (confirm("Are you sure you want to reset your game")) {
        var gameSave = {};
        localStorage.setItem("gameSave", JSON.stringify(gameSave));
        location.reload();
    }
}

document.getElementById("clicker").addEventListener("click", function () {
    game.totalClicks++;
    game.addToCoins(game.clickValue);
}, false);

window.onload = function () {
    loadGame();
    display.updateCoins();
    display.updateUpgrades();
    display.updateShop();
};

setInterval(function () {
    game.coins += game.getCoinsPerSecond();
    game.totalCoins += game.getCoinsPerSecond();
    display.updateCoins();
}, 1000); //1000ms = 1 second (tells how many coins/ms)

setInterval(function () {
    display.updateCoins();
    display.updateUpgrades();
}, 3000); //3000ms = 3 seconds (updates your coins & upgrades/ms)

setInterval(function () {
    saveGame();
}, 3000); //3000ms = 3 seconds (saves your game/ms)

document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.which == 83) { // ctrl + s
        event.preventDefault();
        saveGame();
    }
}, false);