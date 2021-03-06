var portal = portal || {};
portal.Structure = portal.Structure || {};
(function(exports) {
    function subPages() {
        return portal.Socket.ask({
            topic: '/portal/topics/structure',
            payload: {
                command: 'subPages',
                from: portal.Location.current._id
            }
        });
    }
    function createPage(page) {
        return portal.Socket.ask({
            topic: '/portal/topics/structure',
            payload: {
                command: 'addPage',
                from: portal.Location.current._id,
                page: page
            }
        });
    }
    function moveMashetes(mashetes) {
        return portal.Socket.ask({
            topic: '/portal/topics/structure',
            payload: {
                command: 'moveMashetes',
                from: portal.Location.current._id,
                mashetes: mashetes
            }
        });
    }
    function getAllRoles() {
        return portal.Socket.ask({
            topic: '/portal/topics/structure',
            payload: {
                command: 'allRoles'
            }
        });
    }
    function deleteCurrentPage() {
        return portal.Socket.ask({
            topic: '/portal/topics/structure',
            payload: {
                command: 'deletePage',
                from: portal.Location.current._id
            }
        });
    }
    function saveMasheteOptions(id, conf) {
        return portal.Socket.ask({
            topic: '/portal/topics/structure',
            timeout: 2000,
            payload: {
                command: 'changeMasheteOptions',
                id: id,
                conf: conf,
                from: portal.Location.current._id
            }
        });
    }

    exports.subPages = subPages;
    exports.createPage = createPage;
    exports.moveMashetes = moveMashetes;
    exports.getAllRoles = getAllRoles;
    exports.deleteCurrentPage = deleteCurrentPage;
    exports.saveMasheteOptions = saveMasheteOptions;
})(portal.Structure);