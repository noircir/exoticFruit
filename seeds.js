var mongoose 	= require("mongoose"),
	Fruit 		= require("./models/fruit");
	Comment 	= require("./models/comment");

data = [
	{
		name: "Rose",
		image: "https://source.unsplash.com/fj8khFz0jko",
		description: "Nibh vitae morbi malesuada libero auctor, at a sapien lectus vitae lacinia integer, sed quisque eget cum fringilla, commodo sed mauris quam enim duis eget, nemo laoreet purus ultrices. Nonummy urna felis dui mattis tristique ab, maecenas conubia purus vestibulum pede dui eu. Lectus in accumsan massa, interdum sed integer volutpat, nulla nunc sem ipsum vel enim, mauris mollis morbi elit mi. Mattis egestas felis, lorem morbi vivamus dui, aliquet non. "
	},

	{
		name: "Tea rose",
		image: "https://source.unsplash.com/pDGNBK9A0sk",
		description: " Primis volutpat enim, malesuada ornare, eros sociosqu diam arcu illum donec, eu tristique fermentum praesent at duis, faucibus morbi non viverra fusce est. Non curabitur tempus, integer sunt non at, id dui fermentum et molestie vestibulum mauris, posuere risus feugiat vel, euismod ac vel."
	},

	{
		name: "Royal",
		image: "https://source.unsplash.com/3YiZ0B2W8c0",
		description: "Venenatis dictum, vitae sem libero lorem ultricies ut porttitor. Dolor sed neque incididunt amet netus nec."
	}
]


function seedDB() {
	Fruit.remove({}, function(err) {
		// if (err) {
		// 	console.log(err);
		// } else {
		// 	console.log("ALL FRUITS REMOVED IN PREPARATION FOR SEEDING...");
		// 	Comment.remove({}, function(err) {
		// 		if (err) {
		// 			console.log(err);
		// 		} else {
		// 			console.log("ALL COMMENTS REMOVED IN PREPARATION FOR SEEDING...");

		// 			data.forEach(function(item) {
		// 				Fruit.create(item, function(err, fruit) {
		// 					if (err) {
		// 						console.log(err);
		// 					} else {
		// 						console.log("FRUIT CREATED...");
		// 						Comment.create(
		// 						{
		// 							text: "Awesome fruit but I wish I knew where to buy it.",
		// 							author: "Bobby Brown"
		// 						}, function(err, comment) {
		// 							if (err) {
		// 								console.log(err);
		// 							} else {
		// 								fruit.comments.push(comment);
		// 								fruit.save();
		// 								console.log("added a comment");
		// 								// console.log(fruit.comments[0].text);

		// 							}
		// 						});
		// 					}
		// 				});
		// 			});
		// 		}
		// 	});
		// }
	});

}

module.exports = seedDB;