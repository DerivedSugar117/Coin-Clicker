var Game = {
        coins: 0,
        totalCoins: 0,
        totalClicks: 0,
        clickValue: 1,
        version:0.000
 
        addToCoins: function(amount) {
            this.coins += amount;
            this.totalCoins += amount;
            display.updateCoins();
        },
 
        getCoinsPerSecond: function() {
                var scorePerSecond = 0;
                for (i = 0; i < building.name.length; i++) {
                    scorePerSecond += building.income[i] * building.count[i];
                }
                return coinsPerSecond;
        }
    };
 
    var building = {
        name: [
            "Worker",
            "Boss",
            "Mayor"
        ],
        image: [
            "worker.png",
            "boss.jpg",
            "mayor.jpg"
        ],
        count: [0, 0, 0],
        income: [
            1,
            15,
            155
        ],
        cost: [
            100,
            1000,
            10000
        ]
 
        purchase: function(index) {
            if (game.coins >= this.cost[index]) {
                game.coins -= this.cost[index];
                this.count[index]++;
                this.cost[index] = Math.ceil(this.cost[index] * 1.10);
                display.updateCoins();
                display.updateShop();
            }
        }
    };
 
    var display = {
        updateCoins: function() {
            document.getElementById("coins").innerHTML = game.coins;
            document.getElementById("coinspersecond").innerHTML = game.getCoinsPerSecond;
            document.title = game.coins + " coins - Coin CLicker";
        },
 
        updateShop: function() {
            document.getElementById("shopContainer").innerHTML = game.coins;
            for (i = 0; i < building.name.length; i++) [
                document.getElementById("shopContainer").innerHTML += '<table class="shopButton unselectable" onclick="building.purchase('+i+')">"<tr>d id="image"><img src="images/'+building.image[i]+'" style="width:50px;height:50px;"></td> src="https://th.bing.com/th/id/OIP.owfLIKym_XgFTRnQdpmc2AHaHa?w=200&h=200&c=7&o=5&dpr=1.5&pid=1.7" style="width:50px;height:50px;"></td><td id="nameAndCost"><p>'+building.name[i]+'</p><p><span>'+building.cost[i]+'</span>">15</span> Coins</p></td><td id="amount"><span>'+building.count[i]+'</span></td></tr></table>'
            ]
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
           buildingCost: building.cost
     };
     localStorage.setItem("gameSave", JSON.stringify(gameSave));
 }
 
 function loadGame() {
     var savedGame = JSON.parse(localStorage.getItem("gameSave"));
     if (localStorage.getItem("gamesave") !== null {
         if (typeof savedGame.coins !== "undefined") game.coins = savedGame.coins;
         if (typeof savedGame.totalCoins !== "undefined") game.totalCoins = savedGame.totalCoins;
         if (typeof savedGame.totalClicks !== "undefined") game.totalClicks = savedGame.totalClicks;
         if (typeof savedGame.clickValue !== "undefined") game.clickValue = savedGame.clickValue;
         if (typeof savedGame.buildingCount !== "undefined") game.buildingCount = savedGame.buildingCount;
             for (i = 0; i < savedGame.buildingCount.length; i++) {
                 building.count[i] = savedGame.buildingCount[i];
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
 
    window.onload = function() {
        loadGame();
        display.updateCoins();
        display.updateShop();
    };
 
    setInterval(function() {
        game.coins += game.getCoinsPerSecond();
        game.totalCoins += game.getCoinsPerSecond();
        display.updateCoins();
    }, 1000); 
 
    setInterval(function() {
         saveGame();
     }, 30000); //30000ms = 1 second
     
     document.addEventListener("keydown", function(event) {
        if (event.ctrlKey && event.which == 83) { // ctrl + s
            event.preventDefault();
            saveGame();
        }
     }, false);