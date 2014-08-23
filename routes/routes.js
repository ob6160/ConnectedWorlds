exports.page = function(req, res) {
	var query = req.param("page").toLowerCase();
	res.render(query, { title: "RoboArmadillo" }, function(err, body) {
		if(err) {
			res.render('404', { title: "RoboArmadillo" });
		} else {
			res.end(body);
		}
	});
}
