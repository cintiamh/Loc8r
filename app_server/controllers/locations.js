module.exports.homeList = function(req, res) {
    res.render('locations-list',
    {
      title: 'Loc8r - find a place to work with wifi',
      pageHeader: {
        title: 'Loc8r',
        strapline: 'Find places to work with wifi near you!'
      }
    });
};

module.exports.locationInfo = function(req, res) {
    res.render('location-info', { title: 'Location Info' });
};

module.exports.addReview = function(req, res) {
    res.render('location-review-form', { title: 'Add Review' });
};
