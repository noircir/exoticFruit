function Person(name){
	this.name = name;
}

Person.prototype.sayHi=function () {
console.log(this);
return "hi "+this.name;
}

ivan = new Person("Ivan");
console.log(ivan);
console.log(ivan.sayHi());