/** @jsx React.DOM */

var portal = portal || {};
portal.MashetesStore = portal.MashetesStore || {};

// Nicer version of the Todo App using Flux like architecture (http://facebook.github.io/flux/)
(function(exports) {

    var Constants = {
        SAVE_NEW_TASK: 'SAVE_NEW_TASK',
        DELETE_DONE_TASKS: 'DELETE_DONE_TASK',
        CHANGE_TASK_STATE: 'CHANGE_TASK_STATE',
        TASKS_CHANGED: 'TASKS_CHANGED',
        TASKS_ADDED: 'TASKS_ADDED'
    };

    var TaskActions = {
        saveNewTask: function(text) {
            Dispatcher.trigger(Constants.SAVE_NEW_TASK, {text: text});
        },
        deleteDone: function() {
            Dispatcher.trigger(Constants.DELETE_DONE_TASKS, {});
        },
        changeTaskState: function(id, done) {
            Dispatcher.trigger(Constants.CHANGE_TASK_STATE, {id: id, done: done});
        }
    };

    var Dispatcher = _.extend({}, Backbone.Events);

    var TaskStore = (function() {

        var SANDBOX = 'com.foo.bar.TodoMashete';
        var DOC_TYPE = 'TodoMashete.Task';
        var repository = portal.Repository.of(SANDBOX);
        var tasks = [];

        function updateStore() {
            repository.search({ docType: DOC_TYPE }).then(function(data) {
                tasks = data;
                console.log('tasks changed !!!');
                Dispatcher.trigger(Constants.TASKS_CHANGED);
            });
        }

        function createNewTask(text) {
            var task = {
                name: text,
                done: false,
                docType: DOC_TYPE
            };
            repository.save(task).then(function() {
                Dispatcher.trigger(Constants.TASKS_ADDED);
                updateStore();
            });
        }

        function deleteAllDone() {
            repository.removeSelection({
                docType: DOC_TYPE,
                done: true
            }).then(function() {
                updateStore();
            });
        }

        function flipTaskState(id, done) {
            console.log('Set state of ' + id + ' to ' + done);
            repository.save({
                docType: DOC_TYPE,
                _id: id,
                done: done
            }).then(function() {
                updateStore();
            });
        }

        Dispatcher.on(Constants.SAVE_NEW_TASK, function(data) {
            createNewTask(data.text);
        });
        Dispatcher.on(Constants.DELETE_DONE_TASKS, function() {
            deleteAllDone();
        });
        Dispatcher.on(Constants.CHANGE_TASK_STATE, function(data) {
            flipTaskState(data.id, data.done);
        });
        return {
            init: updateStore,
            getAllTasks: function() {
                return tasks;
            }
        };
    })();

    var TaskItem =  React.createClass({displayName: 'TaskItem',
        getInitialState: function () {
            return {
                done: this.props.task.done
            };
        },
        change: function() {
            console.log('Flip state of task ' + this.props.task._id);
            TaskActions.changeTaskState(this.props.task._id, !this.state.done);
            this.setState({
                done: !this.state.done
            });
        },
        render: function () {
            var cx = React.addons.classSet;
            var classes = cx({
                'label': true,
                'label-success': this.state.done,
                'label-default': !this.state.done
            });
            return (
                React.createElement("li", {className: "list-group-item"}, 
                    React.createElement("div", {className: "row"}, 
                        React.createElement("div", {className: "col-md-10"}, 
                            this.props.task.name
                        ), 
                        React.createElement("div", {className: "col-md-2"}, 
                            React.createElement("span", {onClick: this.change, className: classes}, "Done")
                        )
                    )
                )
                );
        }
    });

    var NewTask = React.createClass({displayName: 'NewTask',
        getInitialState: function() {
            return {
                taskName: ''
            };
        },
        clearTaskName: function() {
            console.log('Cleanup text');
            this.setState({
                taskName: ''
            });
        },
        componentDidMount: function() {
            Dispatcher.on(Constants.TASKS_ADDED, this.clearTaskName);
        },
        componentWillUnmount: function() {
            Dispatcher.off(Constants.TASKS_ADDED, this.clearTaskName);
        },
        updateName: function(e) {
            this.setState({taskName: e.target.value});
        },
        save: function() {
            TaskActions.saveNewTask(this.state.taskName);
        },
        deleteAll: function() {
            TaskActions.deleteDone();
        },
        keyPress: function(e) {
            if (e.key === 'Enter') {
                this.save();
                e.preventDefault();
            }
        },
        render: function() {
            return (
                React.createElement("div", null, 
                    React.createElement("div", {className: "row"}, 
                        React.createElement("form", {role: "form"}, 
                            React.createElement("div", {className: "form-group col-md-10"}, 
                                React.createElement("input", {placeholder: "What do you have to do ?", type: "text", className: "form-control", value: this.state.taskName, onChange: this.updateName, onKeyPress: this.keyPress})
                            ), 
                            React.createElement("div", {className: "form-group"}, 
                                React.createElement("div", {className: "btn-group"}, 
                                    React.createElement("button", {type: "button", onClick: this.save, className: "btn btn-success"}, React.createElement("span", {className: "glyphicon glyphicon-floppy-saved"})), 
                                    React.createElement("button", {type: "button", onClick: this.deleteAll, className: "btn btn-danger"}, React.createElement("span", {className: "glyphicon glyphicon-trash"}))
                                )
                            )
                        )
                    )
                )
            );
        }
    });

    var TodoApp = React.createClass({displayName: 'TodoApp',
        getInitialState: function() {
            return {
                tasks: []
            };
        },
        reloadTasks: function() {
            console.log('Re-render tasks');
            this.setState({
                tasks: TaskStore.getAllTasks()
            });
        },
        componentDidMount: function() {
            TaskStore.init();
            Dispatcher.on(Constants.TASKS_CHANGED, this.reloadTasks);
        },
        componentWillUnmount: function() {
            Dispatcher.off(Constants.TASKS_CHANGED, this.reloadTasks);
        },
        render: function() {
            var displayedTasks = _.map(this.state.tasks, function(item) {
                return (React.createElement(TaskItem, {key: item._id, task: item}));
            });
            return (
                React.createElement(portal.Mashetes.Mashete, {title: "Todo list", config: this.props}, 
                    React.createElement("h3", null, "Todo List"), 
                    React.createElement(NewTask, null), 
                    React.createElement("ul", {className: "list-group"}, 
                    displayedTasks
                    )
                )
            );
        }
    });

    exports.TodoMashete = TodoApp;
})(portal.MashetesStore);

