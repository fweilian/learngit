// DOM 优化
// 1. 减少布局信息的获取次数，获取后赋值给局部变量，操作局部变量

// 优化前
myElement.style.left = 1 + myElement.offsetLeft + 'px';
myElement.style.top = 1 + myElement.offsetTop + 'px';
if (myElement.offsetLeft >= 500) {
    stopAnimation();
}

// 优化后
// 获取一次起始位置的值，然后赋值给一个变量，在动画循环中直接使用变量不再查询偏移量
var current = myElement.offsetLeft;
current++;
myElement.style.left = current + 'px';
myElement.style.top = current + 'px';
if (myElement.offsetLeft >= 500) {
    stopAnimation();
}

// 2. 合并多次对DOM 和样式的修改：使用cssText属性
// 优化前
 var el = document.getElementById('mydiv');
 el.style.borderLeft = '1px';
 el.style.borderRight = '2px';
 el.style.padding = '5px';
 
 // 优化后
 var el = document.getElementById('mydiv');
 el.style.cssText = 'border-left: 1px; border-right: 2px; padding: 5px;';

// 3. 合并样式的修改时：修改css的class名称而不是修改内联样式
 var el = document.getElementById('mydiv');
 el.className = "active";

// 4. 使元素脱离文档流、对其改变后再把元素带回文档中
var ul = document.getElementById('mylist');
ul.style.display = 'none';
appendDataToElement(ul, data); // 更新指定节点数据的函数
ul.style.display = 'block';

// 5. （推荐使用）在文档之外创建并更新一个文档片段，然后把它附加到原始列表中

//创建一个文档片段
var fragment = document.createDocumentFragment();
// 更新文档片段的数据
appendDataToElement(fragment, data);
// 将文档片段附加到原始列表中（实际添加的是子节点）
document.getElementById('mylist').appendChild(fragment);


// 6. 备份一个节点，对副本操作，完成后用副本节点代替旧节点
var old = document.getElementById('mylist');
// 对旧节点备份
var clone = old.cloneNode(true);
appendDataToElement(clone, data);
// 用副本节点代替旧节点
old.parentNode.replaceChild(clone, old);

// 7. 让元素脱离动画流
// 许多展开区域的几何动画会将页面其他部分推向下方。一般来说，重排只影响渲染树中的一部分，但是也可能影响很大的部分。
// 当页面顶部的一个动画推移页面整个余下的部分时，会导致一次代价昂贵的大规模重排。
// 使用以下步骤可以避免页面中的大部分重排：

// 使用绝对位置定位页面上的动画元素，将其脱离文档流
// 让元素动起来。当它扩大时，会临时覆盖部分页面。但这只是页面一个小区域的重绘过程，不会产生重排并重绘页面的大部分内容。
// 当动画结束时恢复定位，从而只会下移一次文档的其他元素。