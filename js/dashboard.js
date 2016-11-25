function dashboard(settings) {
    var self = this;
    var modes = ['eco', 'comfort', 'sport', 'sport+'];
    var parent = document.getElementById(settings.id);
    parent.style.width = settings.width + 'px';
    parent.style.height = settings.height + 'px';
    parent.style.backgroundColor = '#000';
    settings.width = settings.width || 1024;
    settings.height = settings.height || 600;
    settings.speedWidthPer = settings.speedWidthPer || 0.45;
    settings.clockWidthPer = settings.clockWidthPer || 0.1;
    settings.revWidthPer = settings.revWidthPer || 0.45;
    settings.mode = settings.mode || modes[1];
    canvasIndex = 0;
    
    var backgroundCanvas = createdCanvas();
    var numberCanvas = createdCanvas();
    var clockCanvas = createdCanvas();
    var infoCanvas = createdCanvas();
    var temperatureCanvas = createdCanvas();
    var backgroundContext = backgroundCanvas.getContext("2d");
    var clockContext = clockCanvas.getContext("2d");
    var numberContext = numberCanvas.getContext("2d");
    var infoContext = infoCanvas.getContext("2d");
    var temperatureContext = temperatureCanvas.getContext("2d");
    var speedCenterPoint;
    var clockCenterPoint;
    var temperatureCenterPoint;
    var revCenterPoint;
    var infoCenterPoint;

    this.setMode = function(mode) {
        if(mode == modes[1]) {
            this.speed = new ComfortSpeed();
            this.rev = new ComfortRev();
            this.clock = new ComfortClock();
            this.temperature = new ComfortTemperature();
            this.info = new ComfortInfo();
            this.limit = new ComfortLimit();
        } else if(mode == modes[2]) {
            this.speed = new SportSpeed();
            this.rev = new SportRev();
            this.clock = new SportClock();
            this.temperature = new SportTemperature();
            this.info = new SportInfo();
            this.limit = new ComfortLimit();
        }
        
        speedCenterPoint = this.speed.getCenterPoint();
        clockCenterPoint = this.clock.getCenterPoint(speedCenterPoint);
        temperatureCenterPoint = this.temperature.getCenterPoint(clockCenterPoint);
        revCenterPoint = this.rev.getCenterPoint(clockCenterPoint);
        infoCenterPoint = this.info.getCenterPoint(speedCenterPoint, revCenterPoint);
        this.speed.drawBackground();
        this.clock.drawBackground();
        this.rev.drawBackground();
        this.speed.drawNumber();
        this.rev.drawNumber();
        this.info.drawBackground();
        this.limit.drawBackground();
    };

    this.setMode(settings.mode);

    setInterval(function() {
        var currentSpeed = self.speed.currentValue;
        var speed = self.speed.value;
        if(speed == currentSpeed) {
            return;
        }
        if(speed > currentSpeed) {
            self.speed.currentValue = currentSpeed + 1;
        } else {
            self.speed.currentValue = currentSpeed - 1;
        }
        self.speed.setValue(currentSpeed);

        var currentRev = self.rev.currentValue;
        var rev = self.rev.value;
        if(rev == currentRev) {
            return;
        }
        if(rev > currentRev) {
            self.rev.currentValue = currentRev + 50;
        } else {
            self.rev.currentValue = currentRev - 50;
        }
        self.rev.setValue(currentRev);
        self.rev.setGear('P');
        self.clock.setValue(new Date());
        self.temperature.setValue(30);
    }, 50);

    function createdCanvas(background) {
        var element = document.createElement('canvas');
        element.width = settings.width;
        element.height = settings.height; 
        element.style = 'position:absolute;z-index:' + (canvasIndex++);
        parent.appendChild(element);
        return element;
    }

    function newPoint(center, angle, radius) {
        var angleHude = angle * Math.PI / 180;
        var x = parseInt(radius * Math.cos(angleHude)) + center.x;
        var y = parseInt(radius * Math.sin(angleHude)) + center.y;
        return {'x':x, 'y':y};
    }

    function ellipse(context, x, y, a, b) {
        context.save();
        var r = (a > b) ? a : b;
        var ratioX = a / r;
        var ratioY = b / r;
        context.scale(ratioX, ratioY);
        context.beginPath();
        context.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI, false);
        context.closePath();
        context.restore();
        context.fill();
    }

    function ComfortSpeed() {
        this.currentValue = 0;
        this.value = 0;
        this.drawBackground = function() {
            backgroundContext.beginPath();
            backgroundContext.strokeStyle = "#999";
            backgroundContext.lineWidth = 6;
            backgroundContext.arc(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2, 0, Math.PI/2, true);
            backgroundContext.stroke();
            backgroundContext.beginPath();
            backgroundContext.strokeStyle = "#777";
            backgroundContext.lineWidth = 1;
            backgroundContext.arc(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2*0.85, 0, Math.PI/2, true);
            backgroundContext.stroke();

            backgroundContext.beginPath();
            var grad = backgroundContext.createRadialGradient(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2*0.85, speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2*0.8);
            grad.addColorStop(0,'#333');
            grad.addColorStop(1,'#000');
            backgroundContext.fillStyle = grad;
            backgroundContext.strokeStyle = "#666";
            backgroundContext.lineWidth = 1;
            backgroundContext.arc(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2*0.85, Math.PI/2, Math.PI*2);
            backgroundContext.fill();

            for(var i=50;i<180;i++) {
                backgroundContext.beginPath();
                var p1 = newPoint(speedCenterPoint, i*2, speedCenterPoint.w/2-5);
                var p2 = newPoint(speedCenterPoint, i*2, speedCenterPoint.w/2*0.85+20);
                backgroundContext.moveTo(p1.x, p1.y);
                backgroundContext.lineTo(p2.x, p2.y);
                backgroundContext.strokeStyle = "#333";
                backgroundContext.lineWidth = 2;
                backgroundContext.stroke();
            }

            for(var i=10;i<36;i++) {
                backgroundContext.beginPath();
                var p1 = newPoint(speedCenterPoint, i*10, speedCenterPoint.w/2-5);
                var p2 = newPoint(speedCenterPoint, i*10, speedCenterPoint.w/2*0.85+8);
                backgroundContext.moveTo(p1.x, p1.y);
                backgroundContext.lineTo(p2.x, p2.y);
                backgroundContext.strokeStyle = "#fff";
                backgroundContext.lineWidth = 3;
                backgroundContext.stroke();
            }

            for(var i=5;i<19;i++) {
                backgroundContext.beginPath();
                var p1 = newPoint(speedCenterPoint, i*20, speedCenterPoint.w/2-5);
                var p2 = newPoint(speedCenterPoint, i*20, speedCenterPoint.w/2*0.85);
                backgroundContext.moveTo(p1.x, p1.y);
                backgroundContext.lineTo(p2.x, p2.y);
                backgroundContext.strokeStyle = "#fff";
                backgroundContext.lineWidth = 5;
                backgroundContext.stroke();
            }

            backgroundContext.beginPath();
            var grad  = backgroundContext.createRadialGradient(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2*0.3, speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2*0.5);
            grad.addColorStop(0,'#000');
            grad.addColorStop(1,'#333');
            backgroundContext.fillStyle = grad;
            backgroundContext.arc(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2*0.5, 0, Math.PI*2);
            backgroundContext.fill();
            backgroundContext.strokeStyle = "#999";
            backgroundContext.lineWidth = 1;
            backgroundContext.arc(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2*0.5-2, 0, Math.PI*2);
            backgroundContext.stroke();

            for(var i=1;i<19;i++) {
                backgroundContext.beginPath();
                var p1 = newPoint(speedCenterPoint, i*20, speedCenterPoint.w/2*0.5+5);
                backgroundContext.moveTo(p1.x, p1.y);
                backgroundContext.lineTo(speedCenterPoint.x, speedCenterPoint.y);
                backgroundContext.strokeStyle = "#000";
                backgroundContext.lineWidth = 2;
                backgroundContext.stroke();
            }

            backgroundContext.beginPath();
            var grad  = backgroundContext.createLinearGradient(speedCenterPoint.x-10, speedCenterPoint.y-10, speedCenterPoint.x+20, speedCenterPoint.y+20);
            grad.addColorStop(0,'#ff0000');
            grad.addColorStop(0.5,'#ff5151');
            grad.addColorStop(0,'#000');
            backgroundContext.strokeStyle = grad;
            backgroundContext.lineWidth = 3;
            backgroundContext.arc(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2*0.15, 0, Math.PI*2, true);
            backgroundContext.stroke();
        };
        this.drawNumber = function(speed) {
            var number = 0
            for(var i=5;i<=18;i++) {
                var p1 = newPoint(speedCenterPoint, i*20, speedCenterPoint.w/2*0.7);
                numberContext.font="24px Arial";
                numberContext.fillStyle = "#666";
                numberContext.textBaseline="middle";
                number.fontWeight = '900';
                if(speed) {
                    if(speed > i*10-3 && speed < i*10+3) {
                        numberContext.font="32px Arial";
                        numberContext.fillStyle = "#fff";
                        number.fontWeight = '900';
                    }
                }
                var x = p1.x;
                var y = p1.y;
                if((number+'').length == 2) {
                    x -= 10;
                } else if((number+'').length == 3) {
                    x -= 25;
                }
                numberContext.fillText(number + '', x, y);
                number += 20;
            }
        };
        this.getCenterPoint = function() {
            var width = settings.width * settings.speedWidthPer;
            return {
                'x': parseInt(width/2),
                'y': parseInt(settings.height/2),
                'w': parseInt(width)
            };
        };
        this.clear = function() {
            numberContext.clearRect(speedCenterPoint.x - speedCenterPoint.w/2, speedCenterPoint.y - speedCenterPoint.w/2, speedCenterPoint.w, speedCenterPoint.w);
        };
        this.setValue = function(speed) {
            speed = 50 + speed/2;
            this.clear();
            this.drawNumber(speed);
            numberContext.restore();
            numberContext.beginPath();
            var p = newPoint(speedCenterPoint, speed*2, speedCenterPoint.w/2*0.85);
            numberContext.moveTo(p.x, p.y);
            numberContext.lineTo(speedCenterPoint.x, speedCenterPoint.y);
            var grad  = numberContext.createLinearGradient(speedCenterPoint.x, speedCenterPoint.y, p.x, p.y);
            grad.addColorStop(0,'#fff');
            grad.addColorStop(1,'#ff5151');
            grad.addColorStop(0,'#fff');
            numberContext.strokeStyle = grad;
            numberContext.lineWidth = 7;
            numberContext.stroke();
            numberContext.moveTo(p.x, p.y);
            numberContext.lineTo(speedCenterPoint.x, speedCenterPoint.y);
            numberContext.strokeStyle = '#fff';
            numberContext.lineWidth = 1;
            numberContext.stroke();
        };
    }

    function SportSpeed() {
        this.currentValue = 0;
        this.value = 0;
        this.drawBackground = function() {
            backgroundContext.beginPath();
            backgroundContext.strokeStyle = "#999";
            backgroundContext.lineWidth = 2;
            backgroundContext.arc(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2, 0, Math.PI/2, true);
            backgroundContext.stroke();
            backgroundContext.beginPath();
            backgroundContext.strokeStyle = "#D94600";
            backgroundContext.lineWidth = 4;
            backgroundContext.arc(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2-6, 0, Math.PI/2, true);
            backgroundContext.stroke();
            backgroundContext.beginPath();
            backgroundContext.strokeStyle = "#FFE4B5";
            backgroundContext.lineWidth = 1;
            backgroundContext.arc(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2-6, 0, Math.PI/2, true);
            backgroundContext.stroke();
            backgroundContext.beginPath();
            backgroundContext.strokeStyle = "#D94600";
            backgroundContext.lineWidth = 4;
            backgroundContext.arc(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2-15, 0, Math.PI/2, true);
            backgroundContext.stroke();
            backgroundContext.beginPath();
            backgroundContext.strokeStyle = "#FFE4B5";
            backgroundContext.lineWidth = 1;
            backgroundContext.arc(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2-18, 0, Math.PI/2, true);
            backgroundContext.stroke();

            backgroundContext.beginPath();
            var grad = backgroundContext.createRadialGradient(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2-15, speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2-25);
            grad.addColorStop(0,'#D94600');
            grad.addColorStop(1,'#000');
            backgroundContext.fillStyle = grad;
            backgroundContext.arc(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2-18, Math.PI/2, Math.PI*2);
            backgroundContext.fill();

            for(var i=50;i<180;i++) {
                backgroundContext.beginPath();
                var p1 = newPoint(speedCenterPoint, i*2, speedCenterPoint.w/2-8);
                var p2 = newPoint(speedCenterPoint, i*2, speedCenterPoint.w/2-12);
                backgroundContext.moveTo(p1.x, p1.y);
                backgroundContext.lineTo(p2.x, p2.y);
                backgroundContext.strokeStyle = "#D94600";
                backgroundContext.lineWidth = 2;
                backgroundContext.stroke();
            }

            backgroundContext.beginPath();
            var grad = backgroundContext.createRadialGradient(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2*0.8, speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2*0.3);
            grad.addColorStop(0,'#000');
            grad.addColorStop(1,'#D94600');
            backgroundContext.fillStyle = grad;
            backgroundContext.arc(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2-30, Math.PI*0.5, Math.PI*1.5, false);
            backgroundContext.fill();
            backgroundContext.beginPath();
            backgroundContext.arc(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2-30, Math.PI, 0, false);
            backgroundContext.fill();

            for(var i=1;i<36;i++) {
                backgroundContext.beginPath();
                var p1 = newPoint(speedCenterPoint, i*10, speedCenterPoint.w/2);
                backgroundContext.moveTo(p1.x, p1.y);
                backgroundContext.lineTo(speedCenterPoint.x, speedCenterPoint.y);
                backgroundContext.strokeStyle = "#000";
                backgroundContext.lineWidth = 1;
                backgroundContext.stroke();
            }

            for(var i=1;i<5;i++) {
                backgroundContext.beginPath();
                var p1 = newPoint(speedCenterPoint, i*80, speedCenterPoint.w/2);
                backgroundContext.moveTo(p1.x, p1.y);
                backgroundContext.lineTo(speedCenterPoint.x, speedCenterPoint.y);
                backgroundContext.strokeStyle = "#000";
                backgroundContext.lineWidth = 4;
                backgroundContext.stroke();
            }
            
            backgroundContext.beginPath();
            backgroundContext.fillStyle = '#000';
            backgroundContext.lineWidth = 3;
            backgroundContext.arc(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2*0.45, 0, Math.PI*2, true);
            backgroundContext.fill();
        };
        this.drawNumber = function(speed) {
            var number = 0
            for(var i=5;i<=18;i++) {
                var p1 = newPoint(speedCenterPoint, i*20, speedCenterPoint.w/2*0.82);
                numberContext.font="20px Arial";
                numberContext.fillStyle = "#999";
                numberContext.textBaseline="middle";
                number.fontWeight = '600';
                if(speed) {
                    if(speed > i*10-3 && speed < i*10+3) {
                        numberContext.font="32px Arial";
                        numberContext.fillStyle = "#fff";
                        numberContext.fontWeight = '900';
                    }
                }
                var x = p1.x;
                var y = p1.y;
                if((number+'').length == 2) {
                    x -= 10;
                } else if((number+'').length == 3) {
                    x -= 25;
                }
                numberContext.fillText(number + '', x, y);
                number += 20;
            }
        };
        this.getCenterPoint = function() {
            var width = settings.width * settings.speedWidthPer;
            return {
                'x': parseInt(width/2),
                'y': parseInt(settings.height/2),
                'w': parseInt(width)
            };
        };
        this.clear = function() {
            numberContext.clearRect(speedCenterPoint.x - speedCenterPoint.w/2, speedCenterPoint.y - speedCenterPoint.w/2, speedCenterPoint.w, speedCenterPoint.w);
        };
        this.setValue = function(speed) {
            speed = 50 + speed/2;
            this.clear();
            this.drawNumber(speed);
            numberContext.restore();
            numberContext.beginPath();
            var p1 = newPoint(speedCenterPoint, speed*2, speedCenterPoint.w/2*0.9);
            var p2 = newPoint(speedCenterPoint, speed*2, speedCenterPoint.w/2*0.45);
            numberContext.moveTo(p1.x, p1.y);
            numberContext.lineTo(p2.x, p2.y);
            var grad  = numberContext.createLinearGradient(speedCenterPoint.x, speedCenterPoint.y, p1.x, p1.y);
            grad.addColorStop(0,'#fff');
            grad.addColorStop(1,'#ff5151');
            grad.addColorStop(0,'#fff');
            numberContext.strokeStyle = grad;
            numberContext.lineWidth = 7;
            numberContext.stroke();
            numberContext.moveTo(p1.x, p1.y);
            numberContext.lineTo(p2.x, p2.y);
            numberContext.strokeStyle = '#fff';
            numberContext.lineWidth = 1;
            numberContext.stroke();
            numberContext.font = '80px Arial';
            numberContext.fillStyle = '#fff';
            numberContext.fontWeight = '900';
            var x = speedCenterPoint.x;
            if((parseInt(speed)+'').length == 2) {
                x = speedCenterPoint.x - 40;
            } else if((parseInt(speed)+'').length == 3) {
                x = speedCenterPoint.x - 60;
            }
            numberContext.fillText(parseInt(speed), x, speedCenterPoint.y);
            numberContext.font = '18px Arial';
            numberContext.fontWeight = '300';
            numberContext.fillText('km/h', speedCenterPoint.x - 10, speedCenterPoint.y + 45);
        };
    }

    function ComfortRev(){
        this.currentValue = 0;
        this.value = 0;
        this.drawBackground = function() {
            backgroundContext.beginPath();
            backgroundContext.strokeStyle = '#999';
            backgroundContext.lineWidth = 6;
            backgroundContext.arc(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2, Math.PI, Math.PI/2,false);
            backgroundContext.stroke();
            backgroundContext.beginPath();
            backgroundContext.strokeStyle = '#777';
            backgroundContext.lineWidth = 1;
            backgroundContext.arc(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2*0.85, Math.PI, Math.PI/2,false);
            backgroundContext.stroke();

            backgroundContext.beginPath();
            var grad = backgroundContext.createRadialGradient(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2*0.85, revCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2*0.8);
            grad.addColorStop(0,'#333');
            grad.addColorStop(1,'#000');
            backgroundContext.fillStyle = grad;
            backgroundContext.strokeStyle = "#666";
            backgroundContext.lineWidth = 1;
            backgroundContext.arc(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2*0.85, Math.PI, Math.PI/2, false);
            backgroundContext.fill();

            for(var i=50;i<125;i++) {
                backgroundContext.beginPath();
                var p1 = newPoint(revCenterPoint, i*3.6, revCenterPoint.w/2-5);
                var p2 = newPoint(revCenterPoint, i*3.6, revCenterPoint.w/2*0.85+20);
                backgroundContext.moveTo(p1.x, p1.y);
                backgroundContext.lineTo(p2.x, p2.y);
                if(i > 120) {
                    backgroundContext.strokeStyle = "#ff0000";
                    backgroundContext.lineWidth = 10;
                } else {
                    backgroundContext.strokeStyle = "#333";
                    backgroundContext.lineWidth = 2;
                }
                
                backgroundContext.stroke();
            }


            for(var i=10;i<26;i++) {
                backgroundContext.beginPath();
                var p1 = newPoint(revCenterPoint, i*18, revCenterPoint.w/2-5);
                var p2 = newPoint(revCenterPoint, i*18, revCenterPoint.w/2*0.85+8);
                backgroundContext.moveTo(p1.x, p1.y);
                backgroundContext.lineTo(p2.x, p2.y);
                backgroundContext.strokeStyle = "#fff";
                backgroundContext.lineWidth = 3;
                backgroundContext.stroke();
            }

            for(var i=5;i<13;i++) {
                backgroundContext.beginPath();
                var p1 = newPoint(revCenterPoint, i*36, revCenterPoint.w/2-5);
                var p2 = newPoint(revCenterPoint, i*36, revCenterPoint.w/2*0.85);
                backgroundContext.moveTo(p1.x, p1.y);
                backgroundContext.lineTo(p2.x, p2.y);
                backgroundContext.strokeStyle = "#fff";
                backgroundContext.lineWidth = 5;
                backgroundContext.stroke();
            }

            backgroundContext.beginPath();
            var grad = backgroundContext.createRadialGradient(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2*0.3, revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2*0.5);
            grad.addColorStop(0,'#000');
            grad.addColorStop(1,'#333');
            backgroundContext.fillStyle = grad;
            backgroundContext.arc(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2*0.5, 0, Math.PI*2);
            backgroundContext.fill();
            backgroundContext.strokeStyle = "#999";
            backgroundContext.lineWidth = 1;
            backgroundContext.arc(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2*0.5-2, 0, Math.PI*2);
            backgroundContext.stroke();

            for(var i=1;i<13;i++) {
                backgroundContext.beginPath();
                var p1 = newPoint(revCenterPoint, i*36, revCenterPoint.w/2*0.5+5);
                backgroundContext.moveTo(p1.x, p1.y);
                backgroundContext.lineTo(revCenterPoint.x, revCenterPoint.y);
                backgroundContext.strokeStyle = "#000";
                backgroundContext.lineWidth = 2;
                backgroundContext.stroke();
            }

            backgroundContext.beginPath();
            var grad = backgroundContext.createLinearGradient(revCenterPoint.x-10, revCenterPoint.y-10, revCenterPoint.x+20, revCenterPoint.y+20);
            grad.addColorStop(0,'#ff0000');
            grad.addColorStop(0.5,'#ff5151');
            grad.addColorStop(0,'#000');
            backgroundContext.strokeStyle = grad;
            backgroundContext.lineWidth = 3;
            backgroundContext.arc(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2*0.15, 0, Math.PI*2, true);
            backgroundContext.stroke();
        };
        this.drawNumber = function(rev) {
            var number = 0
            for(var i=5;i<13;i++) {
                var p1 = newPoint(revCenterPoint, i*36, revCenterPoint.w/2*0.73);
                numberContext.font = '30px Arial';
                numberContext.textBaseline = 'middle';
                numberContext.fillStyle = '#666';
                numberContext.fontWeight = '900';
                if(rev) {
                    if(rev > i*10-3 && rev < i*10+3) {
                        numberContext.font="42px Arial";
                        numberContext.fillStyle = "#fff";
                        numberContext.fontWeight = '900';
                    }
                }
                var x = p1.x;
                var y = p1.y;
                if(number > 3) {
                    x -= 18;
                }
                numberContext.fillText(number + '', x, y);
                number += 1;
            }
        };
        this.getCenterPoint = function(clockCenterPoint) {
            var width = settings.width * settings.revWidthPer;
            return {
                'x': parseInt(clockCenterPoint.x + clockCenterPoint.w/2 + width/2),
                'y': parseInt(settings.height/2),
                'w': parseInt(width)
            };
        };
        this.clear = function() {
            numberContext.clearRect(revCenterPoint.x - revCenterPoint.w/2, revCenterPoint.y - revCenterPoint.w/2, revCenterPoint.w, revCenterPoint.w);
        };
        this.setValue = function(rev) {
            rev = 50 + rev/100;
            this.clear();
            this.drawNumber(rev);
            numberContext.beginPath();
            var p = newPoint(revCenterPoint, rev*3.6, revCenterPoint.w/2*0.85);
            numberContext.moveTo(p.x, p.y);
            numberContext.lineTo(revCenterPoint.x, revCenterPoint.y);
            var grad  = numberContext.createLinearGradient(revCenterPoint.x, revCenterPoint.y, p.x, p.y);
            grad.addColorStop(0,'#fff');
            grad.addColorStop(1,'#ff5151');
            grad.addColorStop(0,'#fff');
            numberContext.strokeStyle = grad;
            numberContext.lineWidth = 7;
            numberContext.stroke();
            numberContext.moveTo(p.x, p.y);
            numberContext.lineTo(revCenterPoint.x, revCenterPoint.y);
            numberContext.strokeStyle = '#fff';
            numberContext.lineWidth = 1;
            numberContext.stroke();
        };
    }

    function SportRev(){
        this.currentValue = 0;
        this.value = 0;
        this.drawBackground = function() {
            backgroundContext.beginPath();
            backgroundContext.strokeStyle = "#999";
            backgroundContext.lineWidth = 2;
            backgroundContext.arc(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2, Math.PI, Math.PI/2,false);
            backgroundContext.stroke();
            backgroundContext.beginPath();
            backgroundContext.strokeStyle = "#D94600";
            backgroundContext.lineWidth = 4;
            backgroundContext.arc(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2-6, Math.PI, Math.PI/2,false);
            backgroundContext.stroke();
            backgroundContext.beginPath();
            backgroundContext.strokeStyle = "#FFE4B5";
            backgroundContext.lineWidth = 1;
            backgroundContext.arc(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2-6, Math.PI, Math.PI/2,false);
            backgroundContext.stroke();
            backgroundContext.beginPath();
            backgroundContext.strokeStyle = "#D94600";
            backgroundContext.lineWidth = 4;
            backgroundContext.arc(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2-15, Math.PI, Math.PI/2,false);
            backgroundContext.stroke();
            backgroundContext.beginPath();
            backgroundContext.strokeStyle = "#FFE4B5";
            backgroundContext.lineWidth = 1;
            backgroundContext.arc(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2-18, Math.PI, Math.PI/2,false);
            backgroundContext.stroke();

            backgroundContext.beginPath();
            var grad = backgroundContext.createRadialGradient(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2-15, revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2-25);
            grad.addColorStop(0,'#D94600');
            grad.addColorStop(1,'#000');
            backgroundContext.fillStyle = grad;
            backgroundContext.arc(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2-18, Math.PI, Math.PI/2,false);
            backgroundContext.fill();

            for(var i=50;i<125;i++) {
                backgroundContext.beginPath();
                var p1 = newPoint(revCenterPoint, i*3.6, revCenterPoint.w/2-8);
                var p2 = newPoint(revCenterPoint, i*3.6, revCenterPoint.w/2-12);
                backgroundContext.moveTo(p1.x, p1.y);
                backgroundContext.lineTo(p2.x, p2.y);
                if(i > 120) {
                    backgroundContext.strokeStyle = "#ff0000";
                    backgroundContext.lineWidth = 10;
                } else {
                    backgroundContext.strokeStyle = "#D94600";
                    backgroundContext.lineWidth = 2;
                }
                backgroundContext.stroke();
            }

            backgroundContext.beginPath();
            var grad = backgroundContext.createRadialGradient(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2*0.8, revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2*0.3);
            grad.addColorStop(0,'#000');
            grad.addColorStop(1,'#D94600');
            backgroundContext.fillStyle = grad;
            backgroundContext.arc(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2-20, Math.PI, 0, false);
            backgroundContext.fill();
            backgroundContext.beginPath();
            backgroundContext.arc(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2-20, Math.PI*1.5, Math.PI*0.5, false);
            backgroundContext.fill();

            for(var i=1;i<26;i++) {
                backgroundContext.beginPath();
                var p1 = newPoint(revCenterPoint, i*18, revCenterPoint.w/2-5);
                backgroundContext.moveTo(p1.x, p1.y);
                backgroundContext.lineTo(revCenterPoint.x, revCenterPoint.y);
                backgroundContext.strokeStyle = "#000";
                backgroundContext.lineWidth = 1;
                backgroundContext.stroke();
            }

            for(var i=5;i<13;i++) {
                backgroundContext.beginPath();
                var p1 = newPoint(revCenterPoint, i*36, revCenterPoint.w/2-5);
                backgroundContext.moveTo(p1.x, p1.y);
                backgroundContext.lineTo(revCenterPoint.x, revCenterPoint.y);
                backgroundContext.strokeStyle = "#000";
                backgroundContext.lineWidth = 4;
                backgroundContext.stroke();
            }

            backgroundContext.beginPath();
            backgroundContext.fillStyle = '#000';
            backgroundContext.lineWidth = 3;
            backgroundContext.arc(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2*0.45, 0, Math.PI*2, true);
            backgroundContext.fill();
        };
        this.drawNumber = function(rev) {
            var number = 0
            for(var i=5;i<13;i++) {
                var p1 = newPoint(revCenterPoint, i*36, revCenterPoint.w/2*0.82);
                numberContext.font = '30px Arial';
                numberContext.textBaseline = 'middle';
                numberContext.fillStyle = '#999';
                numberContext.fontWeight = '900';
                if(rev) {
                    if(rev > i*10-3 && rev < i*10+3) {
                        numberContext.font="42px Arial";
                        numberContext.fillStyle = "#fff";
                        numberContext.fontWeight = '900';
                    }
                }
                var x = p1.x;
                var y = p1.y;
                if(number > 3) {
                    x -= 18;
                }
                numberContext.fillText(number + '', x, y);
                number += 1;
            }
        };
        this.getCenterPoint = function(clockCenterPoint) {
            var width = settings.width * settings.revWidthPer;
            return {
                'x': parseInt(clockCenterPoint.x + clockCenterPoint.w/2 + width/2),
                'y': parseInt(settings.height/2),
                'w': parseInt(width)
            };
        };
        this.clear = function() {
            numberContext.clearRect(revCenterPoint.x - revCenterPoint.w/2, revCenterPoint.y - revCenterPoint.w/2, revCenterPoint.w, revCenterPoint.w);
        };
        this.setValue = function(rev) {
            rev = 50 + rev/100;
            this.clear();
            this.drawNumber(rev);
            numberContext.beginPath();
            var p1 = newPoint(revCenterPoint, rev*3.6, revCenterPoint.w/2*0.9);
            var p2 = newPoint(revCenterPoint, rev*3.6, revCenterPoint.w/2*0.45);
            numberContext.moveTo(p1.x, p1.y);
            numberContext.lineTo(p2.x, p2.y);
            var grad  = numberContext.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            grad.addColorStop(0,'#fff');
            grad.addColorStop(1,'#ff5151');
            grad.addColorStop(0,'#fff');
            numberContext.strokeStyle = grad;
            numberContext.lineWidth = 7;
            numberContext.stroke();
            numberContext.moveTo(p1.x, p1.y);
            numberContext.lineTo(p2.x, p2.y);
            numberContext.strokeStyle = '#fff';
            numberContext.lineWidth = 1;
            numberContext.stroke();
        };
        this.setGear = function(gear) {
            numberContext.font='80px Arial';
            numberContext.fillStyle = '#fff';
            numberContext.fontWeight = '900';
            numberContext.fillText(gear, revCenterPoint.x - 20, revCenterPoint.y);
        };
    }

    function ComfortClock() {
        this.scale = 0.2;
        this.currentValue1 = -1;
        this.currentValue2 = -1;  
        this.drawBackground = function() {
            var scale = this.scale;
            clockContext.clearRect(clockCenterPoint.x - clockCenterPoint.w/2, clockCenterPoint.y - clockCenterPoint.w/2, clockCenterPoint.x + clockCenterPoint.w/2, clockCenterPoint.y + clockCenterPoint.w/2);
            clockContext.translate(clockCenterPoint.x - 100, clockCenterPoint.y - 40);
            clockContext.scale(scale, scale);
            clockContext.beginPath();
            clockContext.strokeStyle = '#fff';
            clockContext.lineWidth = 6;
            clockContext.arc(clockCenterPoint.x, clockCenterPoint.y, clockCenterPoint.w/2/scale, 0, Math.PI*2);
            clockContext.stroke();
            clockContext.beginPath();
            clockContext.strokeStyle = '#333';
            clockContext.lineWidth = 4;
            clockContext.arc(clockCenterPoint.x, clockCenterPoint.y, clockCenterPoint.w/2*0.7/scale, 0, Math.PI*2);
            clockContext.stroke();

            for(var i=0;i<60;i++) {
                clockContext.beginPath();
                var p1 = newPoint(clockCenterPoint, i*6, (clockCenterPoint.w/2-2)/scale);
                var p2 = newPoint(clockCenterPoint, i*6, (clockCenterPoint.w/2 * 0.7+7)/scale);
                clockContext.moveTo(p1.x, p1.y);
                clockContext.lineTo(p2.x, p2.y);
                clockContext.strokeStyle = '#666';
                clockContext.lineWidth = 3;
                clockContext.stroke();
            }

            for(var i=0;i<12;i++) {
                clockContext.beginPath();
                var p1 = newPoint(clockCenterPoint, i*30, (clockCenterPoint.w/2-2)/scale);
                var p2 = newPoint(clockCenterPoint, i*30, (clockCenterPoint.w/2 * 0.7+2)/scale);
                clockContext.moveTo(p1.x, p1.y);
                clockContext.lineTo(p2.x, p2.y);
                clockContext.strokeStyle = '#fff';
                clockContext.lineWidth = 4;
                clockContext.stroke();
            }

        };
        this.getCenterPoint = function(speedCenterPoint) {
            var width = settings.width * settings.clockWidthPer;
            return {
                'x': parseInt(speedCenterPoint.x + speedCenterPoint.w/2 + width/2),
                'y': parseInt(settings.height/4),
                'w': parseInt(width)
            };
        };
        this.setValue = function(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            if(this.currentValue1 != hours || this.currentValue2 != minutes) {
                var scale = this.scale;
                clockContext.beginPath();
                var p1 = newPoint(clockCenterPoint, (hours-3)*30, clockCenterPoint.w/2/scale * 0.7*0.6-2);
                clockContext.moveTo(clockCenterPoint.x, clockCenterPoint.y);
                clockContext.lineTo(p1.x, p1.y);
                clockContext.strokeStyle = '#ff0000';
                clockContext.lineWidth = 5;
                clockContext.stroke();

                clockContext.beginPath();
                var p1 = newPoint(clockCenterPoint, (minutes-15)*6, clockCenterPoint.w/2/scale *0.7-2);
                clockContext.moveTo(clockCenterPoint.x, clockCenterPoint.y);
                clockContext.lineTo(p1.x, p1.y);
                clockContext.strokeStyle = '#ff0000';
                clockContext.lineWidth = 5;
                clockContext.stroke();
            }
        };
    }

    function SportClock() {
        this.currentValue1 = -1;
        this.currentValue2 = -1;     
        this.drawBackground = function() {
            clockContext.beginPath();
            var grad = clockContext.createRadialGradient(clockCenterPoint.x, clockCenterPoint.y, clockCenterPoint.w/2*0.9, clockCenterPoint.x, clockCenterPoint.y, clockCenterPoint.w/2*0.1);
            grad.addColorStop(0,'#000');
            grad.addColorStop(1,'#555');
            clockContext.fillStyle = grad;
            clockContext.arc(clockCenterPoint.x, clockCenterPoint.y, clockCenterPoint.w/2, 0, Math.PI*2, false);
            clockContext.fill();

            clockContext.beginPath();
            clockContext.moveTo(clockCenterPoint.x - clockCenterPoint.w/2, clockCenterPoint.y + 20);
            clockContext.lineTo(clockCenterPoint.x + clockCenterPoint.w/2, clockCenterPoint.y + 20);
            clockContext.strokeStyle = '#f0f0f0';
            clockContext.lineWidth = 1;
            clockContext.stroke();
        };
        this.getCenterPoint = function(speedCenterPoint) {
            var width = settings.width * settings.clockWidthPer;
            return {
                'x': parseInt(speedCenterPoint.x + speedCenterPoint.w/2 + width/2),
                'y': parseInt(settings.height/4),
                'w': parseInt(width)
            };
        };
        this.setValue = function(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            if(this.currentValue1 != hours || this.currentValue2 != minutes) {
                clockContext.clearRect(clockCenterPoint.x - clockCenterPoint.w/2, clockCenterPoint.y - clockCenterPoint.w/2, clockCenterPoint.w, clockCenterPoint.w);
                clockContext.beginPath();
                var grad = clockContext.createRadialGradient(clockCenterPoint.x, clockCenterPoint.y, clockCenterPoint.w/2*0.9, clockCenterPoint.x, clockCenterPoint.y, clockCenterPoint.w/2*0.1);
                grad.addColorStop(0,'#000');
                grad.addColorStop(1,'#555');
                clockContext.fillStyle = grad;
                clockContext.arc(clockCenterPoint.x, clockCenterPoint.y, clockCenterPoint.w/2, 0, Math.PI*2, false);
                clockContext.fill();

                clockContext.beginPath();
                clockContext.moveTo(clockCenterPoint.x - clockCenterPoint.w/2, clockCenterPoint.y + 20);
                clockContext.lineTo(clockCenterPoint.x + clockCenterPoint.w/2, clockCenterPoint.y + 20);
                clockContext.strokeStyle = '#f0f0f0';
                clockContext.lineWidth = 1;
                clockContext.stroke();

                clockContext.font='40px Microsoft YaHei';
                clockContext.fillStyle = '#f0f0f0';
                clockContext.fontWeight = '100';
                clockContext.fillText((hours<10?('0'+hours):hours) + ':' + (minutes<10?('0'+minutes):minutes), clockCenterPoint.x - 48, clockCenterPoint.y);
                this.currentValue1 = hours;
                this.currentValue2 = minutes;
            }
        };
    }

    function ComfortTemperature() {
        this.currentValue = -99;
        this.getCenterPoint = function(clockCenterPoint) {
            return {
                x: clockCenterPoint.x - clockCenterPoint.w/2 + 20,
                y: clockCenterPoint.y + clockCenterPoint.w/2 + 20
            }
        };
        this.setValue = function(temperature) {
            if(this.currentValue != temperature) {
                temperatureContext.font='6px Arial bold';
                temperatureContext.fillStyle = '#666';
                temperatureContext.textBaseline = 'middle';
                temperatureContext.fillText((temperature>=0?'+ ':'- ') + temperature + '.0 ℃', temperatureCenterPoint.x, temperatureCenterPoint.y);
            }
        };
    }

    function SportTemperature() {
        this.currentValue = -99;
        this.getCenterPoint = function(clockCenterPoint) {
            return {
                x: clockCenterPoint.x - clockCenterPoint.w/2 + 20,
                y: clockCenterPoint.y + clockCenterPoint.w/2
            }
        };
        this.setValue = function(temperature) {
            if(this.currentValue != temperature) {
                temperatureContext.font='16px Arial bold';
                temperatureContext.fillStyle = '#f0f0f0';
                temperatureContext.textBaseline = 'middle';
                temperatureContext.fillText((temperature>=0?'+ ':'- ') + temperature + '.0 ℃', temperatureCenterPoint.x, temperatureCenterPoint.y);
                this.currentValue = temperature;
            }
        };
    }

    function ComfortInfo() {
        this.drawBackground = function() {
            infoContext.beginPath();
            var grad = infoContext.createRadialGradient(infoCenterPoint.x, infoCenterPoint.y, infoCenterPoint.w/2*0.95, infoCenterPoint.x, infoCenterPoint.y, infoCenterPoint.w/2*0.75);
            grad.addColorStop(0.2,'#000');
            grad.addColorStop(0.8,'#333');
            grad.addColorStop(1,'#666');
            infoContext.fillStyle = grad;
            infoContext.strokeStyle = "#666";
            infoContext.arc(infoCenterPoint.x, infoCenterPoint.y, infoCenterPoint.w/2, Math.PI, Math.PI*2, false);
            infoContext.fill();

            infoContext.beginPath();
            infoContext.strokeStyle = '#000';
            infoContext.fillStyle = '#000';
            infoContext.moveTo(speedCenterPoint.x, speedCenterPoint.y + speedCenterPoint.w/2);
            infoContext.lineTo(speedCenterPoint.x + speedCenterPoint.w/2*0.45, speedCenterPoint.y + speedCenterPoint.w/2*0.3);
            infoContext.lineTo(infoCenterPoint.x - 40, revCenterPoint.y + revCenterPoint.w/2*0.3);
            infoContext.lineTo(infoCenterPoint.x - 35, revCenterPoint.y + revCenterPoint.w/2*0.3 + 5);
            infoContext.lineTo(infoCenterPoint.x + 35, revCenterPoint.y + revCenterPoint.w/2*0.3 + 5);
            infoContext.lineTo(infoCenterPoint.x + 40, revCenterPoint.y + revCenterPoint.w/2*0.3);
            infoContext.lineTo(revCenterPoint.x - revCenterPoint.w/2*0.45, revCenterPoint.y + revCenterPoint.w/2*0.3);
            infoContext.lineTo(revCenterPoint.x, revCenterPoint.y + revCenterPoint.w/2);
            infoContext.lineTo(speedCenterPoint.x, speedCenterPoint.y + revCenterPoint.w/2);
            infoContext.stroke();
            infoContext.fill();

            infoContext.beginPath();
            var grad = infoContext.createLinearGradient(infoCenterPoint.x - 170, revCenterPoint.y + revCenterPoint.w/2*0.3 + 5, infoCenterPoint.x + 170, revCenterPoint.y + speedCenterPoint.w/2 - 40);
            grad.addColorStop(0.1, '#000');
            grad.addColorStop(0.5, '#222');
            grad.addColorStop(0.1, '#666');
            infoContext.fillStyle = grad;
            infoContext.moveTo(infoCenterPoint.x - 35, revCenterPoint.y + revCenterPoint.w/2*0.3 + 5);
            infoContext.lineTo(infoCenterPoint.x - 170, revCenterPoint.y + speedCenterPoint.w/2 - 40);
            infoContext.lineTo(infoCenterPoint.x - 130, revCenterPoint.y + speedCenterPoint.w/2 - 60);
            infoContext.lineTo(infoCenterPoint.x + 130, revCenterPoint.y + speedCenterPoint.w/2 - 60);
            infoContext.lineTo(infoCenterPoint.x + 170, revCenterPoint.y + speedCenterPoint.w/2 - 40);
            infoContext.lineTo(infoCenterPoint.x + 35, revCenterPoint.y + revCenterPoint.w/2*0.3 + 5);
            infoContext.lineTo(infoCenterPoint.x - 35, revCenterPoint.y + revCenterPoint.w/2*0.3 + 5);
            infoContext.fill();

            infoContext.beginPath();
            infoContext.strokeStyle = '#999';
            infoContext.moveTo(infoCenterPoint.x - 40, revCenterPoint.y + revCenterPoint.w/2*0.3);
            infoContext.lineTo(speedCenterPoint.x + 80, speedCenterPoint.y + speedCenterPoint.w/2 - 40);
            infoContext.moveTo(infoCenterPoint.x + 40, revCenterPoint.y + revCenterPoint.w/2*0.3);
            infoContext.lineTo(revCenterPoint.x - 80, revCenterPoint.y + speedCenterPoint.w/2 - 40);
            infoContext.moveTo(infoCenterPoint.x - 170, revCenterPoint.y + speedCenterPoint.w/2 - 40);
            infoContext.lineTo(infoCenterPoint.x - 130, revCenterPoint.y + speedCenterPoint.w/2 - 60);
            infoContext.lineTo(infoCenterPoint.x + 130, revCenterPoint.y + speedCenterPoint.w/2 - 60);
            infoContext.lineTo(infoCenterPoint.x + 170, revCenterPoint.y + speedCenterPoint.w/2 - 40);
            infoContext.stroke();
        };
        this.getCenterPoint = function(speedCenterPoint, revCenterPoint) {
            return {
                x: speedCenterPoint.x + (revCenterPoint.x - speedCenterPoint.x)/2,
                y: revCenterPoint.y + revCenterPoint.w/2,
                w: revCenterPoint.w
            }
        };
        this.setTotal = function(total) {
            infoContext.font="12px Arial ";
            infoContext.fillStyle = "#999";
            infoContext.textBaseline = "middle";
            infoContext.fontWeight = '100';
            infoContext.fillText('TOTAL', infoCenterPoint.x - 130, revCenterPoint.y + speedCenterPoint.w/2 - 30);
            infoContext.font="16px Arial";
            infoContext.fillStyle = "#fff";
            infoContext.fontWeight = '900';
            infoContext.fillText(total + ' km', infoCenterPoint.x - 90, revCenterPoint.y + speedCenterPoint.w/2 - 30);
        };
        this.setTrip = function(trip) {
            infoContext.font = '12px Arial';
            infoContext.fillStyle = '#999';
            infoContext.textBaseline = 'middle';
            infoContext.fontWeight = '100';
            infoContext.fillText('TRIP', infoCenterPoint.x + 35, revCenterPoint.y + speedCenterPoint.w/2 - 30);
            infoContext.font = '16px Arial';
            infoContext.fillStyle = '#fff';
            infoContext.fontWeight = '900';
            infoContext.fillText(trip + ' km', infoCenterPoint.x + 70, revCenterPoint.y + speedCenterPoint.w/2 - 30);
        };
    }

    function SportInfo() {
        this.drawBackground = function() {
            infoContext.beginPath();
            var grad = infoContext.createRadialGradient(infoCenterPoint.x, infoCenterPoint.y, infoCenterPoint.w/2*0.95, infoCenterPoint.x, infoCenterPoint.y, infoCenterPoint.w/2*0.75);
            grad.addColorStop(0.2,'#000');
            grad.addColorStop(0.8,'#333');
            grad.addColorStop(1,'#666');
            infoContext.fillStyle = grad;
            infoContext.strokeStyle = "#666";
            infoContext.arc(infoCenterPoint.x, infoCenterPoint.y, infoCenterPoint.w/2, Math.PI, Math.PI*2, false);
            infoContext.fill();

            infoContext.beginPath();
            infoContext.strokeStyle = '#000';
            infoContext.fillStyle = '#000';
            infoContext.moveTo(speedCenterPoint.x, speedCenterPoint.y + speedCenterPoint.w/2);
            infoContext.lineTo(speedCenterPoint.x + speedCenterPoint.w/2*0.45, speedCenterPoint.y + speedCenterPoint.w/2*0.3);
            infoContext.lineTo(infoCenterPoint.x - 40, revCenterPoint.y + revCenterPoint.w/2*0.3);
            infoContext.lineTo(infoCenterPoint.x - 35, revCenterPoint.y + revCenterPoint.w/2*0.3 + 5);
            infoContext.lineTo(infoCenterPoint.x + 35, revCenterPoint.y + revCenterPoint.w/2*0.3 + 5);
            infoContext.lineTo(infoCenterPoint.x + 40, revCenterPoint.y + revCenterPoint.w/2*0.3);
            infoContext.lineTo(revCenterPoint.x - revCenterPoint.w/2*0.45, revCenterPoint.y + revCenterPoint.w/2*0.3);
            infoContext.lineTo(revCenterPoint.x, revCenterPoint.y + revCenterPoint.w/2);
            infoContext.lineTo(speedCenterPoint.x, speedCenterPoint.y + revCenterPoint.w/2);
            infoContext.stroke();
            infoContext.fill();

            infoContext.beginPath();
            var grad = infoContext.createLinearGradient(infoCenterPoint.x - 170, revCenterPoint.y + revCenterPoint.w/2*0.3 + 5, infoCenterPoint.x + 170, revCenterPoint.y + speedCenterPoint.w/2 - 40);
            grad.addColorStop(0.1, '#000');
            grad.addColorStop(0.5, '#222');
            grad.addColorStop(0.1, '#666');
            infoContext.fillStyle = grad;
            infoContext.moveTo(infoCenterPoint.x - 35, revCenterPoint.y + revCenterPoint.w/2*0.3 + 5);
            infoContext.lineTo(infoCenterPoint.x - 170, revCenterPoint.y + speedCenterPoint.w/2 - 40);
            infoContext.lineTo(infoCenterPoint.x - 130, revCenterPoint.y + speedCenterPoint.w/2 - 60);
            infoContext.lineTo(infoCenterPoint.x + 130, revCenterPoint.y + speedCenterPoint.w/2 - 60);
            infoContext.lineTo(infoCenterPoint.x + 170, revCenterPoint.y + speedCenterPoint.w/2 - 40);
            infoContext.lineTo(infoCenterPoint.x + 35, revCenterPoint.y + revCenterPoint.w/2*0.3 + 5);
            infoContext.lineTo(infoCenterPoint.x - 35, revCenterPoint.y + revCenterPoint.w/2*0.3 + 5);
            infoContext.fill();

            infoContext.beginPath();
            infoContext.strokeStyle = '#D94600';
            infoContext.moveTo(infoCenterPoint.x - 40, revCenterPoint.y + revCenterPoint.w/2*0.3);
            infoContext.lineTo(speedCenterPoint.x + 80, speedCenterPoint.y + speedCenterPoint.w/2 - 40);
            infoContext.moveTo(infoCenterPoint.x + 40, revCenterPoint.y + revCenterPoint.w/2*0.3);
            infoContext.lineTo(revCenterPoint.x - 80, revCenterPoint.y + speedCenterPoint.w/2 - 40);
            infoContext.moveTo(infoCenterPoint.x - 170, revCenterPoint.y + speedCenterPoint.w/2 - 40);
            infoContext.lineTo(infoCenterPoint.x - 130, revCenterPoint.y + speedCenterPoint.w/2 - 60);
            infoContext.lineTo(infoCenterPoint.x + 130, revCenterPoint.y + speedCenterPoint.w/2 - 60);
            infoContext.lineTo(infoCenterPoint.x + 170, revCenterPoint.y + speedCenterPoint.w/2 - 40);
            infoContext.stroke();
        };
        this.getCenterPoint = function(speedCenterPoint, revCenterPoint) {
            return {
                x: speedCenterPoint.x + (revCenterPoint.x - speedCenterPoint.x)/2,
                y: revCenterPoint.y + revCenterPoint.w/2,
                w: revCenterPoint.w
            }
        };
        this.setTotal = function(total) {
            infoContext.font="12px Arial ";
            infoContext.fillStyle = "#999";
            infoContext.textBaseline = "middle";
            infoContext.fontWeight = '100';
            infoContext.fillText('TOTAL', infoCenterPoint.x - 130, revCenterPoint.y + speedCenterPoint.w/2 - 30);
            infoContext.font="16px Arial";
            infoContext.fillStyle = "#fff";
            infoContext.fontWeight = '900';
            infoContext.fillText(total + ' km', infoCenterPoint.x - 90, revCenterPoint.y + speedCenterPoint.w/2 - 30);
        };
        this.setTrip = function(trip) {
            infoContext.font = '12px Arial';
            infoContext.fillStyle = '#999';
            infoContext.textBaseline = 'middle';
            infoContext.fontWeight = '100';
            infoContext.fillText('TRIP', infoCenterPoint.x + 35, revCenterPoint.y + speedCenterPoint.w/2 - 30);
            infoContext.font = '16px Arial';
            infoContext.fillStyle = '#fff';
            infoContext.fontWeight = '900';
            infoContext.fillText(trip + ' km', infoCenterPoint.x + 70, revCenterPoint.y + speedCenterPoint.w/2 - 30);
        };
    }

    function ComfortLimit() {
        this.drawBackground = function() {
            infoContext.beginPath();
            infoContext.fillStyle = '#ff0000';
            infoContext.arc(speedCenterPoint.x + speedCenterPoint.w/2*0.5, speedCenterPoint.y+speedCenterPoint.w/4, 25, 0, Math.PI*2);
            infoContext.fill();
            infoContext.beginPath();
            infoContext.fillStyle = '#fff';
            infoContext.arc(speedCenterPoint.x + speedCenterPoint.w/2*0.5, speedCenterPoint.y+speedCenterPoint.w/4, 20, 0, Math.PI*2);
            infoContext.fill();
        };
        this.clear = function() {
            infoContext.fillStyle = '#fff';
            infoContext.fillRect(speedCenterPoint.x + speedCenterPoint.w/2*0.5 - 15, speedCenterPoint.y+speedCenterPoint.w/4-10, 30, 20);
        };
        this.setValue = function(limit) {
            this.clear();
            infoContext.font = '17px Arial bold';
            infoContext.fillStyle = '#000';
            infoContext.textBaseline = 'middle';
            if(limit) {
                if((limit + '').length == 1) {
                    infoContext.fillText(limit + '', speedCenterPoint.x + speedCenterPoint.w/2*0.5-5, speedCenterPoint.y+speedCenterPoint.w/4);
                } else if((limit + '').length == 2) {
                    infoContext.fillText(limit + '', speedCenterPoint.x + speedCenterPoint.w/2*0.5-10, speedCenterPoint.y+speedCenterPoint.w/4);
                } else {
                    infoContext.fillText(limit + '', speedCenterPoint.x + speedCenterPoint.w/2*0.5-15, speedCenterPoint.y+speedCenterPoint.w/4);
                }
            } else {
                infoContext.fillText('---', speedCenterPoint.x+ speedCenterPoint.w/2*0.5-10, speedCenterPoint.y+speedCenterPoint.w/4);                
            }
        };
    }
}
