/**
 * Created by Administrator on 2017/9/28.
 */
var start = document.querySelector("#start-warp")
var end = document.querySelector("#end-warp")
var endMsg = document.querySelector("#endMsg")
var bg = document.querySelector("#bg")
var score = document.querySelector(".score")
var scoreInfo = document.querySelector("#scoreInfo")
var canvas = document.querySelector('#canvas')
var ctx = canvas.getContext('2d')      // 获取 canvas 的上下文
canvas.width = document.body.clientWidth
canvas.height = document.body.clientHeight
start.addEventListener("touchstart", function () {
    Game()
    start.style.display = "none"
})
end.addEventListener("touchstart", function () {
    window.location.reload()
    end.style.display = "none"
})
function Game() {
    //Snake
    function Snake() {
        this._init()
    }

    Snake.prototype = {
        //初始化数据
        _init: function () {
            this.canvas = canvas
            this.ctx = ctx
            this.canvasW = canvas.width
            this.canvasH = canvas.height
            this.moveDirection = "right"
            this.snakeX = 60
            this.snakeY = 0
            this.snakeW = 20
            this.snakeH = 20
            this.body = [[40, 0], [20, 0], [0, 0]]
            this.snakeHColor = "red"
            this.snakeBColor = "cyan"
            this.score = 0
            this.drawSnake()
            this.touchEvent()
        },
        //绘制蛇
        drawSnake: function () {
            this.ctx.beginPath()
            this.ctx.fillStyle = this.snakeBColor
            for (let i = 0; i < this.body.length; i++) {
                this.ctx.fillRect(this.body[i][0] + 2.5, this.body[i][1] + 2.5, this.snakeW - 5, this.snakeH - 5)
            }

            this.ctx.beginPath()
            this.ctx.fillStyle = this.snakeHColor
            this.ctx.fillRect(this.snakeX, this.snakeY, this.snakeW, this.snakeH)

            this.timer = setTimeout(function move() {
                this.ctx.clearRect(0, 0, this.canvasW, this.canvasH)

                this.body.pop()
                this.body.unshift([this.snakeX, this.snakeY])

                switch (this.moveDirection) {
                    case "right":
                        this.snakeX += 20
                        break;
                    case "up":
                        this.snakeY -= 20
                        break;
                    case "down":
                        this.snakeY += 20
                        break;
                    case "left":
                        this.snakeX -= 20
                        break;
                }

                if (this.snakeX < 0)
                    this.snakeX = this.canvasW - this.snakeW
                else if (this.snakeX >= this.canvasW)
                    this.snakeX = 0
                if (this.snakeY < 0)
                    this.snakeY = this.canvasH - this.snakeH
                else if (this.snakeY >= this.canvasH)
                    this.snakeY = 0

                //检测吃到自己
                for (let i = 0; i < this.body.length; i++) {
                    let bodyObj = {
                        x: this.body[i][0],
                        y: this.body[i][1],
                        w: this.snakeW - 5,
                        h: this.snakeH - 5
                    }
                    let snakeObj = {
                        x: this.snakeX,
                        y: this.snakeY,
                        w: this.snakeW,
                        h: this.snakeH
                    }
                    if (this.isCrash(snakeObj, bodyObj)) {
                        alert("Game Over")
                        end.style.display = "block"
                        score.style.display = "none"
                        scoreInfo.innerHTML = `<span style="color:#ff5000;font-size:60px">${this.score}</span> kg`
                        endMsg.innerHTML = Math.random() > 0.5 ? "小青被你喂的很胖了,不美了都." : "小青很饱了,她吃不下了,休息一下吧."
                        return
                    }
                }

                if (this.rectCrash()) {
                    //吃食
                    this.eatFood()
                }
                //投食
                food.putFood()

                this.drawSnake()
                setTimeout(this.timer, this.body.length / 100)

            }.bind(this), 100)
        },
        //吃食物
        eatFood: function () {
            this.body.push([food.foodX - 2.5, food.foodY - 2.5])
            food.foodX = randomInt(0, this.canvasW - food.foodW)
            food.foodY = randomInt(0, this.canvasH - food.foodH)
            food.putFood()
            this.score++
            console.log(this.score);
            score.innerHTML = "weight: " + this.score + "kg"
        },
        //touch event
        touchEvent: function () {
            var hammerTime = new Hammer(document);
            hammerTime.get('pan').set({direction: Hammer.DIRECTION_ALL});

            hammerTime.on("panup", listener)        //上滑
            hammerTime.on("pandown", listener)      //下滑
            hammerTime.on("panright", listener)     //右滑
            hammerTime.on("panleft", listener)      //左滑

            function listener(event) {
                event.preventDefault();

                if (event.type == "panup") {
                    if (snake.moveDirection == "down") return;
                    snake.moveDirection = "up";
                } else if (event.type == "pandown") {
                    if (snake.moveDirection == "up") return;
                    snake.moveDirection = "down";
                } else if (event.type == "panright") {
                    if (snake.moveDirection == "left") return;
                    snake.moveDirection = "right";
                } else if (event.type == "panleft") {
                    if (snake.moveDirection == "right") return;
                    snake.moveDirection = "left";
                }
            }
        },
        //碰撞检测  (蛇头与身体)
        isCrash: function (snake, food) {
            var L1 = snake.x
            var T1 = snake.y
            var R1 = snake.x + snake.w
            var B1 = snake.y + snake.h

            var L2 = food.x
            var T2 = food.y
            var R2 = food.x + food.w
            var B2 = food.y + food.h

            if (R1 <= L2 || B1 <= T2 || L1 >= R2 || T1 >= B2) {
                return false
            } else {
                return true
            }
        },
        //判断碰撞食物
        rectCrash: function () {
            var snakeL = snake.snakeX
            var snakeR = snake.snakeX + snake.snakeW
            var snakeT = snake.snakeY
            var snakeB = snake.snakeY + snake.snakeH

            var foodL = food.foodX
            var foodR = food.foodX + food.foodW
            var foodT = food.foodY
            var foodB = food.foodY + food.foodH

            if (snakeR > foodL &&
                snakeB > foodT &&
                snakeL < foodR &&
                snakeT < foodB) {
                return true
            } else {
                return false
            }
        }
    }

    var snake = new Snake()

//Food
    function Food() {
        this._initFood()
    }

    Food.prototype = {
        _initFood: function () {
            this.canvas = canvas
            this.ctx = ctx
            this.canvasW = canvas.width
            this.canvasH = canvas.height

            this.foodW = 15
            this.foodH = 15
            this.foodX = randomInt(0, this.canvasW - this.foodW)
            this.foodY = randomInt(0, this.canvasH - this.foodH)
            this.foodColor = "cyan"
        },
        //投放食物
        putFood: function () {
            this.ctx.fillStyle = this.foodColor
            this.ctx.fillRect(this.foodX, this.foodY, this.foodW, this.foodH)
        },
    }
    var food = new Food()

//随机函数
    function randomInt(from, to) {
        return parseInt(Math.random() * (to - from + 1) + from);
    }
}
