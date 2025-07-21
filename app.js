var AbstractMethodError = require('./errors').AbstractMethodError;
var AbstractClassError = require('./errors').AbstractClassError;
var LangUtils = require('./utils').LangUtils;
/**
 *
 * @class
 * @abstract
 * @param {string=} configPath
 */
// eslint-disable-next-line no-unused-vars
function IApplication(configPath) {
    if (this.constructor === IApplication.prototype.constructor) {
        throw new AbstractClassError();
    }
}

/**
 * Registers an application strategy e.g. a singleton service which to be used in application context
 * @param {Function} serviceCtor
 * @param {Function} strategyCtor
 * @returns IApplication
 */
// eslint-disable-next-line no-unused-vars
IApplication.prototype.useStrategy = function(serviceCtor, strategyCtor) {
    throw new AbstractMethodError();
};

/**
* @param {Function} serviceCtor
* @returns {boolean}
*/
// eslint-disable-next-line no-unused-vars
IApplication.prototype.hasStrategy = function(serviceCtor) {
    throw new AbstractMethodError();
};

/**
 * Gets an application strategy based on the given base service type
 * @param {Function} serviceCtor
 * @return {*}
 */
// eslint-disable-next-line no-unused-vars
IApplication.prototype.getStrategy = function(serviceCtor) {
    throw new AbstractMethodError();
};
/**
 * @returns {ConfigurationBase}
 */
IApplication.prototype.getConfiguration = function() {
    throw new AbstractMethodError();
};


/**
 *
 * @class
 * @abstract
 * @param {IApplication} app
 */
// eslint-disable-next-line no-unused-vars
function IApplicationService(app) {
    if (this.constructor === IApplicationService.prototype.constructor) {
        throw new AbstractClassError();
    }
}

/**
 * @returns {IApplication}
 */
IApplicationService.prototype.getApplication = function() {
    throw new AbstractMethodError();
};
/**
 *
 * @class
 * @constructor
 * @param {ApplicationBase} app
 */
// eslint-disable-next-line no-unused-vars
function ApplicationService(app) {
    ApplicationService.super_.bind(this)(app);
    Object.defineProperty(this, 'application', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: app
    });
}
LangUtils.inherits(ApplicationService,IApplicationService);
/**
 * @returns {ApplicationBase}
 */
ApplicationService.prototype.getApplication = function() {
    return this.application;
};

module.exports.IApplication = IApplication;
module.exports.IApplicationService = IApplicationService;
module.exports.ApplicationService = ApplicationService;
