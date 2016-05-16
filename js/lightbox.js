function Lightbox(){
    this.container = "";
    this.imageNode = "";
    this.titleNode = "";
    this.currentImageNode = "";
    this.isCreate = false;
    this.init();
}

Lightbox.prototype ={
	createNode : function(){     //创建幻灯节点
		var _self = this;
		//创建背景
		this.container = $('<div class="lightbox-container"></div>');
        
		//创建灯箱面板
		var wrapper = $('<div class="lightbox-wrapper"></div>').appendTo(this.container);
        //对this.container绑定点击退出事件，但不对其子节点进行绑定
    	$(this.container).on('click',function(e){
			if(e.target == this){
                _self.hide();
            }
		});        

		//创建面板下的图片节点
		var imageWrapper = $('<div class="lightbox-image-wrapper"></div>').appendTo(wrapper);

        //创建图片节点
        this.imageNode = $('<img class="lightbox-image"/>').appendTo(imageWrapper);

        //创建左按钮
        var prevNode = $('<span class="lightbox-prev"></span>').appendTo(imageWrapper);

        //绑定上一张按钮事件
        prevNode.on('click',function(){
        	_self.toPrev();
        });

        //创建右按钮
        var nextNode = $('<span class="lightbox-next"></span>').appendTo(imageWrapper);

        //绑定下一张按钮事件
        nextNode.on('click',function(){
        	_self.toNext();
        });

        //创建面板下的title以及close按钮
        var noteNode = $('<div class="lightbox-note"></div>').appendTo(wrapper);

        //创建标题
        this.titleNode =$('<p class="lightbox-title"></p>').appendTo(noteNode);

        //创建关闭按钮
        var closeNode = $('<span class="lightbox-close"></span>').appendTo(noteNode);
        //绑定关闭按钮事件
        closeNode.on('click',function(){
        	_self.hide();
        });
        
        $(document.body).append(this.container);
        this.container.css("opacity","0");
        this.isCreate = true;
	},
	toPrev :function(){   //跳转到上一张
 		//得到当前图片的索引
        var index = this.images.indexOf(this.currentImageNode);
        //计算下一张图片的索引
        index <= 0 ? index = this.images.length -1 : index--;
        this.goTo(index);
	},
	toNext : function(){   //跳转到下一张
		//得到当前图片的索引
        var index = this.images.indexOf(this.currentImageNode);
        //计算下一张图片的索引
        index >= this.images.length -1 ? index = 0 : index++;
        this.goTo(index);
	},
	goTo : function(index){  //跳转到某一张
		var imageNode = this.images[index];
        this.show(imageNode);
	},
	update : function(imageNode){  //更新图片节点
 		var _self = this;
        var images = this.images;
        var imgNode = _self.imageNode;
  
        //得到要显示的图片节点的地址
        var src=$(imageNode).attr('data-lightbox');
        //在加载完成之前隐藏
        imgNode.css("opacity", 0);

        this.container.addClass("lightbox-loading");
        //创建一个新的图片节点，计算图片的原始宽高,掩藏当前创建的新图片节点
        var newImg = $('<img />').attr('src',src)
                    .css("position","absolute").css("top","-99999px");
        //对图片节点进行一个加载完成绑定事件
        newImg.on('load',function(){
            //计算图片的原始大小
            var imgWidth = this.width;
            var imgHeight =this.height;

            //计算浏览器可视窗口大小
            var clientWidth = document.documentElement.clientWidth;
            var clientHeight = document.documentElement.clientHeight;

            //将图片等比例缩小
            var scale = Math.max(imgWidth/clientWidth , imgHeight/clientHeight);
            //设置新的图片
            imgNode.width(scale > 1 ? imgWidth/scale*0.8 :imgWidth).height(scale > 1 ? imgHeight/scale*0.8 :imgHeight)
                   .delay(400).attr('src',src).animate({opacity : 1}, 400);

            //清除图片
            newImg.remove();
            _self.container.removeClass("lightbox-loading");
        });
        $(document.body).append(newImg);
        //计算图片集合的长度以及当前图片的索引
        var index = images.indexOf(imageNode) + 1;
        this.titleNode.text($(imageNode).attr('title') + " " +index + "/" + images.length);
    },
	show :function(imageNode){  //显示幻灯片面板
		var _self = this;
        this.isShow = true;
        //创建幻灯片节点并加载到页面
        this.isCreate || this.createNode();
        this.currentImageNode = imageNode;

        //更新图片
        this.update(this.currentImageNode);
        this.container.fadeIn();

        //设置创建节点的背景动画
        if(this.container.css("opacity") === "0" || this.container.css("opacity") === "undefined"){
            _self.container.animate({opacity : 1}, 400);
        }
	},
	hide :function(){   //掩藏幻灯片面板
		this.isShow = false;
        this.container.fadeOut(100,0);
	},
 	init :function(){   //初始化函数
 		var _self = this;
 		//得到data-lightbox属性的images集合
        var images = $('[data-lightbox]');
        //将集合转化为数组
        this.images = Array.prototype.slice.call(images);
        //对每张图片进行以及点击事件的绑定
        images.each(function(index,item){
            $(_self.images[index]).on("click",function(){
                 _self.show(_self.images[index]);
            })
        })

 		//绑定键盘事件
 		$(document).on('keyup',function(e){
 			if(_self.isCreate){
                switch(e.keyCode){
                    case 27 :
                        _self.hide();
                        break;
                    case 37 : 
                        _self.toPrev();
                        break;
                    case 39 : 
                        _self.toNext();
                        break;
                }
            }
 		});
 		//窗口变化的时候，调整幻灯片的大小
 		$(window).on('resize',function(){
 			_self.isCreate && _self.isShow && _self.update(_self.currentImageNode);
 		});
    }
}
new Lightbox();