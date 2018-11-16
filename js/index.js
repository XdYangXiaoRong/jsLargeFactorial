(function(){
    var stage, textStage, form, input,toast;
    var circles, textPixels, textFormed;
    var offsetX, offsetY, text;
    var colors = ['#B2949D', '#FFF578', '#FF5F8D', '#37A9CC', '#188EB2'];
    var factorialNumber,valueContent;//factorialNumber：大数阶乘的结果；valueContent:存放结果的dom；
    var stringResultContent,stringResultContent2,stringCopyButton,stringCopyButton2;

    function initPage() {//压面初始化
        initStages();
        initForm();
        initText();
        initCircles();
        animate();
        addListeners();
        copyStringResult();//文本复制的监听
    }

    // Init Canvas
    function initStages() {//背景画布
        offsetX = (window.innerWidth-600)/2;
        offsetY = (window.innerHeight-500)/2;
        textStage = new createjs.Stage("text");
        textStage.canvas.width = 600;
        textStage.canvas.height = 200;

        stage = new createjs.Stage("stage");
        stage.canvas.width = window.innerWidth;
        stage.canvas.height = window.innerHeight;
        console.log("stage",stage)
    }

    function initForm() {//form定位
        form = document.getElementById('form');
        form.style.top = offsetY+200+'px';
        form.style.left = offsetX+'px';
        input = document.getElementById('inputText');
        toast = document.getElementById('toast');
        valueContent=document.getElementById('valueContent');
        valueContent.style.top=offsetY+300+'px';
        stringResultContent=document.getElementById('stringResult');
        stringResultContent2=document.getElementById('stringResult2');
        stringCopyButton=document.getElementById('stringCopyButton');
        stringCopyButton2=document.getElementById('stringCopyButton2');
        // valueContent.style.left = offsetX+'px';
    }

    function initText() {
        text = new createjs.Text("t", "80px 'Source Sans Pro'", "#eee");
        text.textAlign = 'center';
        text.x = 300;
    }

    function initCircles() {//随机生成页面上的动态小圆圈的坐标位置
        circles = [];
        for(var i=0; i<600; i++) {
            var circle = new createjs.Shape();
            var r = 7;
            var x = window.innerWidth*Math.random();
            var y = window.innerHeight*Math.random();
            var color = colors[Math.floor(i%colors.length)];
            var alpha = 0.2 + Math.random()*0.5;
            circle.alpha = alpha;
            circle.radius = r;
            circle.graphics.beginFill(color).drawCircle(0, 0, r);
            circle.x = x;
            circle.y = y;
            circles.push(circle);
            stage.addChild(circle);
            circle.movement = 'float';
            tweenCircle(circle);
        }
    }


    // animating circles
    function animate() {
        stage.update();
        requestAnimationFrame(animate);
    }

    function tweenCircle(c, dir) {
        if(c.tween) c.tween.kill();
        if(dir == 'in') {
            c.tween = TweenLite.to(c, 0.4, {x: c.originX, y: c.originY, ease:Quad.easeInOut, alpha: 1, radius: 5, scaleX: 0.4, scaleY: 0.4, onComplete: function() {
                c.movement = 'jiggle';
                tweenCircle(c);
            }});
        } else if(dir == 'out') {
            c.tween = TweenLite.to(c, 0.8, {x: window.innerWidth*Math.random(), y: window.innerHeight*Math.random(), ease:Quad.easeInOut, alpha: 0.2 + Math.random()*0.5, scaleX: 1, scaleY: 1, onComplete: function() {
                c.movement = 'float';
                tweenCircle(c);
            }});
        } else {
            if(c.movement == 'float') {
                c.tween = TweenLite.to(c, 5 + Math.random()*3.5, {x: c.x + -100+Math.random()*200, y: c.y + -100+Math.random()*200, ease:Quad.easeInOut, alpha: 0.2 + Math.random()*0.5,
                    onComplete: function() {
                        tweenCircle(c);
                    }});
            } else {
                c.tween = TweenLite.to(c, 0.05, {x: c.originX + Math.random()*3, y: c.originY + Math.random()*3, ease:Quad.easeInOut,
                    onComplete: function() {
                        tweenCircle(c);
                    }});
            }
        }
    }

    function formText() {
        for(var i= 0, l=textPixels.length; i<l; i++) {
            circles[i].originX = offsetX + textPixels[i].x;
            circles[i].originY = offsetY + textPixels[i].y;
            tweenCircle(circles[i], 'in');
        }
        // textFormed = false;
        if(textPixels.length < circles.length) {
            for(var j = textPixels.length; j<circles.length; j++) {
                circles[j].tween = TweenLite.to(circles[j], 0.4, {alpha: 0.1});
            }
        }
    }

    function explode() {
        for(var i= 0, l=textPixels.length; i<l; i++) {
            tweenCircle(circles[i], 'out');
        }
        if(textPixels.length < circles.length) {
            for(var j = textPixels.length; j<circles.length; j++) {
                circles[j].tween = TweenLite.to(circles[j], 0.4, {alpha: 1});
            }
        }
    }


    // event handlers
    function addListeners() {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var timer=null;
            var reg= /^[1-9]\d*$/;//正整数的正则表达式
            if(reg.test(input.value.trim())) {
                var inputVal=input.value.trim()
                createText(inputVal);
                explode();
                clearTimeout(timer)
                timer=setTimeout(function() {
                    createText(inputVal+"!");
                }, 800);
                input.value=''
                factorialNumber = largeFactorial(inputVal)
                valueContent.style.visibility="visible"
                stringResultContent.innerHTML=factorialNumber;//展示结果
                // console.log(factorialNumber)
                var fixNumber=numberfix(factorialNumber)
                stringResultContent2.innerHTML=fixNumber;
                // console.log(2333,saaaa)

            }else if(parseInt(input.value.trim(),10)===0){
                valueContent.style.visibility="visible"
                stringResultContent.innerHTML=1;//展示结果
            } else {
               toastMessage(toast,"请输入一个正整数")
            }

        });
    }
    function copyStringResult(){
        function CopyText(content){
            console.log("copy")
            document.designMode = 'on'
            var text = content.innerText;
            var input = document.getElementById("hiddenInput");
            input.value = text; // 修改文本框的内容
            if(input.select){
                input.select(); // 选中文本
            }else{
                input.focus()
                input.setSelectionRange(0, input.value.length)
            }
            console.log(document.execCommand("copy"))
            document.execCommand("copy"); // 执行浏览器复制命令
            document.designMode = 'off'
                // execCommand("Copy")
                // window.clipboardData.setData("Text", input.value);//设置数据
        }
        stringCopyButton.addEventListener('click',CopyText.bind(null,stringResultContent),false)
        stringCopyButton2.addEventListener('click',CopyText.bind(null,stringResultContent2),false)
    }

    

    function createText(t) {//生成页面上的动态字
        var fontSize = 860/(t.length);
        if (fontSize > 160) fontSize = 160;
        text.text = t;
        text.font = "900 "+fontSize+"px 'Source Sans Pro'";
        text.textAlign = 'center';
        text.x = 300;
        text.y = (172-fontSize)/2;
        textStage.addChild(text);
        textStage.update();

        var ctx = document.getElementById('text').getContext('2d');
        var pix = ctx.getImageData(0,0,600,200).data;
        textPixels = [];
        for (var i = pix.length; i >= 0; i -= 4) {
            if (pix[i] != 0) {
                var x = (i / 4) % 600;
                var y = Math.floor(Math.floor(i/600)/4);

                if((x && x%8 == 0) && (y && y%8 == 0)) {   
                  textPixels.push({x: x, y: y});
                }
            }
        }
        formText();
    }

    function toastMessage(el,text,timer){//toast组件
        el.style.display="block";
        el.innerHTML=text;
        var timer;
        clearTimeout(timer);
        timer=setTimeout(()=>{
            el.style.display="none";
        },timer|| 1500)
    }

    function largeFactorial(n) {//大数阶乘算法
        if(n<=0){
            return '请输入一个正整数！'
        }
        var resultArray = [1];//初始化一个数组，用来存放乘积的各个位，因为位数不一定，所以数组的0……n，依次为个位、十位、百位……
        for (var i = 1; i <= n; i++) {
            //将n和数组的每一位相乘，即和上一次的结果的个位、十位、百位依次相乘，大于等于10则进位，保留当前位的余数，
            //carry为向下一位的进位
            //若数组的每一项都已经乘完，且最后一位有carry，那么就扩展一位
            for (var j = 0, carry = 0; j < resultArray.length || carry != 0; j++) {
                var count;
                if(j<resultArray.length){//与resultArray的每一项相乘并加上低位的进位
                    count=i*resultArray[j]+carry;
                }else{//已经到最后一位了，要向更高一位进位
                    count=carry;
                }
                resultArray[j]=count%10;
                carry=(count-resultArray[j])/10;//向下个高位的进位
            }
        }
        return resultArray.reverse().join("");//将得到的从低位到高位的乘积反转，得到阶乘值
      }

      function numberfix(number){
          var length=number.length;//这个数字总共有多少位
          var dealNumber=number.split('').reverse()
          console.log(23333,dealNumber)
          for(var i=0;i<dealNumber.length-1;i++){
              if(parseInt(dealNumber[i],10)!==0){
                  break
              }
              if(parseInt(dealNumber[i],10)===0){
                dealNumber.splice(i,1)
                i--;
              }
          }
          dealNumber.reverse().splice(1,0,'.')
          var dealString=dealNumber.join('');
          var numberFix=dealString+'e+'+(length-1)*1
          console.log('numberFix',numberFix)
          return numberFix
      }
    window.onload = function() { initPage() };
})();