function dashboard(settings) {
    var canvas = settings.canvas;
    settings.gasWidthPer = settings.gasWidthPer || 0.1;
    settings.speedWidthPer = settings.speedWidthPer || 0.35;
    settings.clockWidthPer = settings.clockWidthPer || 0.1;
    settings.revWidthPer = settings.revWidthPer || 0.35;
    settings.temperatureWidthPer = settings.temperatureWidthPer || 0.1;
    var gasCenterPoint = getGasCenterPoint(canvas);
    var speedCenterPoint = getSpeedCenterPoint(gasCenterPoint, canvas);
    var clockCenterPoint = getClockCenterPoint(speedCenterPoint, canvas);
    var revCenterPoint = getRevCenterPoint(clockCenterPoint, canvas);
    var temperatureCenterPoint = getTemperatureCenterPoint(revCenterPoint, canvas);
    if(canvas.getContext){
        var ctx = canvas.getContext("2d");
        drawSpeedBackground(ctx, speedCenterPoint);
        drawClockBackground(ctx, clockCenterPoint);
        drawClockBackground(ctx, clockCenterPoint);
        drawRevBackground(ctx, revCenterPoint);
        drawSpeedNumber(ctx, speedCenterPoint);
    }

    function getGasCenterPoint(canvas) {
        var width = canvas.width * settings.gasWidthPer;
        return {
            'x': parseInt(width/2),
            'y': parseInt(canvas.height - canvas.height/4),
            'w': width
        };
    }

    function getSpeedCenterPoint(gasCenterPoint, canvas) {
        var width = canvas.width * settings.speedWidthPer;
        return {
            'x': parseInt(gasCenterPoint.x + gasCenterPoint.w/2 + width/2),
            'y': parseInt(canvas.height/2),
            'w': width
        };
    }

    function getClockCenterPoint(speedCenterPoint, canvas) {
        var width = canvas.width * settings.clockWidthPer;
        return {
            'x': parseInt(speedCenterPoint.x + speedCenterPoint.w/2 + width/2),
            'y': parseInt(canvas.height/3.5),
            'w': width
        };
    }

    function getRevCenterPoint(clockCenterPoint, canvas) {
        var width = canvas.width * settings.revWidthPer;
        return {
            'x': parseInt(clockCenterPoint.x + clockCenterPoint.w/2 + width/2),
            'y': parseInt(canvas.height/2),
            'w': width
        };
    }

    function getTemperatureCenterPoint(revCenterPoint, canvas) {
        var width = canvas.width * settings.temperatureWidthPer;
        return {
            'x': parseInt(revCenterPoint.x + revCenterPoint.w/2 + width/2),
            'y': parseInt(canvas.height - canvas.height/4),
            'w': width
        };
    }

    function newPoint(center, angle, radius) {
        var angleHude = angle * Math.PI / 180;
        var x = parseInt(radius * Math.cos(angleHude)) + center.x;
        var y = parseInt(radius * Math.sin(angleHude)) + center.y;
        return {'x':x, 'y':y};
    }

    function drawSpeedBackground(ctx, speedCenterPoint) {
        ctx.beginPath();
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 3;
        ctx.arc(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2, 0, Math.PI/2, true);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        ctx.arc(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2*0.85, 0, Math.PI/2, true);
        ctx.stroke();

        for(var i=50;i<180;i++) {
            ctx.beginPath();
            var p1 = newPoint(speedCenterPoint, i*2, speedCenterPoint.w/2-5);
            var p2 = newPoint(speedCenterPoint, i*2, speedCenterPoint.w/2*0.85+10);
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "#333";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        for(var i=10;i<36;i++) {
            ctx.beginPath();
            var p1 = newPoint(speedCenterPoint, i*10, speedCenterPoint.w/2-5);
            var p2 = newPoint(speedCenterPoint, i*10, speedCenterPoint.w/2*0.85+8);
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        for(var i=5;i<=18;i++) {
            ctx.beginPath();
            var p1 = newPoint(speedCenterPoint, i*20, speedCenterPoint.w/2-5);
            var p2 = newPoint(speedCenterPoint, i*20, speedCenterPoint.w/2*0.85);
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        ctx.beginPath();
        var grad  = ctx.createLinearGradient(speedCenterPoint.x-speedCenterPoint.w/2*0.5, speedCenterPoint.y-speedCenterPoint.w/2*0.5, speedCenterPoint.x+speedCenterPoint.w/2*0.5, speedCenterPoint.x+speedCenterPoint.w/2*0.5);
        grad.addColorStop(0,'#333');
        grad.addColorStop(0.5,'#000');
        grad.addColorStop(0,'#333');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 10;
        ctx.arc(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2*0.5, 0, Math.PI/2, true);
        ctx.stroke();

        for(var i=5;i<18;i++) {
            ctx.beginPath();
            var p1 = newPoint(speedCenterPoint, i*20, speedCenterPoint.w/2*0.5+5);
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(speedCenterPoint.x, speedCenterPoint.y);
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // draw center red point
        ctx.beginPath();
        var grad  = ctx.createLinearGradient(speedCenterPoint.x-10, speedCenterPoint.y-10, speedCenterPoint.x+20, speedCenterPoint.y+20);
        grad.addColorStop(0,'#ff0000');
        grad.addColorStop(0.5,'#ff5151');
        grad.addColorStop(0,'#000');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 3;
        ctx.arc(speedCenterPoint.x, speedCenterPoint.y, speedCenterPoint.w/2*0.15, 0, Math.PI*2, true);
        ctx.stroke();
    }

    function drawRevBackground(ctx, revCenterPoint) {
        ctx.beginPath();
        ctx.strokeStyle = "#999";
        //沿着坐标点(100,100)为圆心、半径为50px的圆的逆时针方向绘制弧线
        ctx.arc(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2, Math.PI, Math.PI/2,false);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        ctx.arc(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2*0.85, Math.PI, Math.PI/2,false);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "#999";
        ctx.arc(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2*0.5, Math.PI, Math.PI/2,false);
        ctx.stroke();

        // draw center red point
        ctx.beginPath();
        var grad  = ctx.createLinearGradient(revCenterPoint.x-10, revCenterPoint.y-10, revCenterPoint.x+20, revCenterPoint.y+20);
        grad.addColorStop(0,'#000');
        grad.addColorStop(0.5,'#ff5151');
        grad.addColorStop(0,'#000');
        /* 将这个渐变设置为fillStyle */
        ctx.strokeStyle = grad;
        ctx.lineWidth = 4;
        ctx.arc(revCenterPoint.x, revCenterPoint.y, revCenterPoint.w/2*0.15, 0, Math.PI*2, true);
        ctx.stroke();
    }

    function drawClockBackground(ctx, clockCenterPoint) {
        // draw clock background
        ctx.beginPath();
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 1;
        ctx.arc(clockCenterPoint.x, clockCenterPoint.y, clockCenterPoint.w/2*0.7, 0, Math.PI*2);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        ctx.arc(clockCenterPoint.x, clockCenterPoint.y, clockCenterPoint.w/2*0.7*0.6, 0, Math.PI*2);
        ctx.stroke();

        for(var i=0;i<60;i++) {
            ctx.beginPath();
            var p1 = newPoint(clockCenterPoint, i*6, clockCenterPoint.w/2*0.7-2);
            var p2 = newPoint(clockCenterPoint, i*6, clockCenterPoint.w/2*0.7*0.6+6);
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "#333";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        for(var i=0;i<12;i++) {
            ctx.beginPath();
            var p1 = newPoint(clockCenterPoint, i*30, clockCenterPoint.w/2*0.7-2);
            var p2 = newPoint(clockCenterPoint, i*30, clockCenterPoint.w/2*0.7*0.6+2);
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        ctx.beginPath();
        var p1 = newPoint(clockCenterPoint, 6*30, clockCenterPoint.w/2*0.7-2);
        ctx.moveTo(clockCenterPoint.x, clockCenterPoint.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        var p1 = newPoint(clockCenterPoint, 3*30, clockCenterPoint.w/2*0.7*0.6-2);
        ctx.moveTo(clockCenterPoint.x, clockCenterPoint.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function drawSpeedNumber(ctx, speedCenterPoint) {
        var number = 0
        for(var i=5;i<=18;i++) {
            var p1 = newPoint(speedCenterPoint, i*20, speedCenterPoint.w/2*0.75);
            ctx.font="16px Arial bold";
            ctx.textBaseline="middle";
            ctx.fillStyle = "#666";
            var x = p1.x;
            var y = p1.y;
            if((number+'').length == 2) {
                x -= 10;
            } else if((number+'').length == 3) {
                x -= 16;
            }
            ctx.fillText(number + '', x, y);
            number += 20;
        }
    }
}
