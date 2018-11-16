# jsLargeFactorial
js大数编程:1000的阶乘
求1000的阶乘

# 1、刚开始想到的是for循环的方法，听起来其实1000是一个很小的数，但是……
```bash
function test(n){
	if(n<=0){
		return 1;
	}
	var count=1;
	for(var i=1;i<n;i++){
		count=count*n;
	}
	return count;
}
```
#事实上这种方法最多只能到100！，否则就超出了。


#2、然后面完试走在路上的时候突然想到当时为什么不用递归，很生自己的气，回来后打开电脑一试……,竟然最多只能到170的阶乘，多一个都不行了。

```bash
function test2(n){
	if(n<=0){
		return 1;
	}
	return arguments.callee(n-1)*n;
}
```

#3、仔细研究了一下，js数字大小有限制，解决这个问题的只能是将大数字存储在字符串当中，但是字符串又不好进行加减乘除操作，所以可以将数字的每一位存储在数组中，然后再join('')成一个字符串输出。
#我觉得如果我可以用数组的形式解决两个大数相乘的问题，那么这么问题就可以解决了，所以我开始想办法做大数相乘的函数，思路如下：

```bash
function multiplication(count,n){//输入乘数1：count，乘数2：n
  if(count===0 || n===0){
    return 0;
  }
  var nArray=n.toString().split('').reverse();//将乘数2的各个位拆到数组里，反转数组，从左到右依次是个位、十位、百位……
  var countArray=count.toString().split('');//将乘数1的各个位拆到数组里,从左到有依次是高位到低位
  var lastArray=[];//二位数组，用来存放count与乘数2的个位、十位、百位……的乘积
  var returnArray=[];//存放最终结果的数组

  for(var j=0;j<nArray.length;j++){//计算count与乘数2(n)的每一位的乘积并保存在数组lastArray中
    var newCountArray=[];//用来存放count与乘数2的个位、十位、百位……的乘积
    for(var k=countArray.length-1,before=0;k>=0 || before!=0;k--){//从低位开始相乘，before为低位向下一个高位的进位
      newCountArray[k]=(nArray[j]*countArray[k]+before)%10;//当前位的取值=（乘数2的某一位与count每一位的乘积+进位）%10,取余数
      before=(nArray[j]*countArray[k]+before-newCountArray[k])/10;//向高位的进位
      if(before!==0 &&k<=0){
      	//如果整个count的数组已经遍历完，还有进位，那么数组长度加1，该进位为newCountArray新的最高位
        newCountArray.unshift(before);
        before=0; // 最高位进位了，结果最大值加1
      }
    }
    	/*注：设count=92345，n=12
					那么此时newCountArray分别为[1, 8, 4, 6, 9, 0]，[9, 2, 3, 4, 5]
    	*/
      lastArray[j]=newCountArray.reverse();//为方便计算：将newCountArray反转，即从低位到高位排序
  }
#####注：设count=92345，n=12
#####那么此时lastArray分别为[0, 9, 6, 4, 8, 1]，[5, 4, 3, 2, 9]
 
#####为了给错位相加做准备①计算，求出最长数组长度，将数组的长度都改为最长长度（最高位补0，对数字大小不会有影响）
  var lengthArray=[];
  for(var i=0;i<lastArray.length;i++){
    lengthArray.push(lastArray[i].length)
  }
  var MathLength=Math.max.apply(null,lengthArray)

#####注：设count=92345，n=12，那么此时MathLength=6
  for(var l=0;l<lastArray.length;l++){//将所有数组的长度都改为一致
      if(lastArray[l].length<MathLength){
        lastArray[l].push(0)
      }
  }
#####注：设count=92345，n=12
#####那么此时lastArray= [[0, 9, 6, 4, 8, 1],
#####					     [5, 4, 3, 2, 9, 0]]
 
  
  for(var i=0;i<lastArray.length;i++){
    if(lastArray.length===0){//若乘数2：n，是个位数，那么lastArray[0]已经是最后结果的数组的反转
      returnArray=lastArray[0]
      break;
    }
   
    for(var x=0;x<i;x++){//为错位相加做准备②,较高一位的数组要在末尾补一个0
        lastArray[i].unshift(0);//不足的自动补零
    }
#####注：设count=92345，n=12
#####那么此时lastArray= [[0, 9, 6, 4, 8, 1],
#####					 [0, 5, 4, 3, 2, 9, 0]]
#####此时可以看出最终结果的个位：0+0，十位：9+5，百位6+4+进位，依次类推

    #####接下来，进行错位相加
    for(var x=0,before2=0;x<lastArray[i].length || before2!==0;x++){//before2为向上一位的进位
      var temp=returnArray[x];//当超出数组长度，这个数不存在时，设为0
      if(!temp){
        temp=0;
      }
      returnArray[x]=(temp+lastArray[i][x]+before2)%10;
      before2=(temp+lastArray[i][x]+before2-returnArray[x])/10;
      if(before2!==0 && x>=lastArray[i].length){
        returnArray.push(before2);
        before2=0;
        // 最高位进位了，结果最大值加1
      }
    }
#####注：设count=92345，n=12
#####那么此时returnArray=  [0, 4, 1, 8, 0, 1, 1]
#####将returnArray反转得到[1,1,0,8,1,4,0]，转换为字符串即可得到最终结果
#####因为做错位相乘的准备①时，在前面补了0，此时这个0，可能还存在，最后要去掉数字前面的0
#####
  }
  	return returnArray.reverse().join('').replace(/\b(0+)/gi,""); //反转并返回结果，且去掉首位可能存在的0     
}
function test3(n){
	if(n<=0){
		return 1;
	}
	var count=1;
	for(var i=1;i<=n;i++){
		count=multiplication(count,i)
	}
	return count;
}
```

#经过一番波折，终于实现了一个通过数组和字符串实现阶乘的算法了，但是试了一下，发现竟然只支持到94！,竟然还不如for循环，内心是崩溃的！但是仔细观察一下，大致思路还是对的，但是这个方法开辟了太多的数组，占用了越来越多的空间，乘数与被乘数的结果每次都要保存在一个超长的数组里，非常的不科学。根据观察，在做阶乘的过程中，被乘数会越来越大，但是乘数是1,2,3,4,……,1000是依次递增的，并不是特别大，所以可不可以把每次相乘后的结果拆分到数组里，有进位就向更高一位进位，并保存在数组中，于是乎有了4的想法。

#4、
```bash
  function largeFactorial(n) {//大数阶乘算法
    if(n<=0){
        return 1;
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
```
