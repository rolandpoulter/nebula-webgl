var engine = require('./engine').init(document.getElementById('nebula'));

window.engine = engine;
window.nebula = require('./nebula').init(engine);
