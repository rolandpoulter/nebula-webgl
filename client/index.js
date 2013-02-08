var engine = require('./engine').init(document.body);

window.engine = engine;

require('./square').init(engine);

//window.nebula = require('./nebula').init(engine);
