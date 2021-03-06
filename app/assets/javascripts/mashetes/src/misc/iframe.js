var React = require('react');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            displayedTitle: this.props.title,
            displayedUrl: this.props.url,
            displayedHeight: this.props.height || '500px',
            displayedWidth: this.props.width || "100%",
            displayedAllowTransparency: this.props.allowTransparency || true,
            displayedClass: this.props.class || 'pushTop',
            displayedFrameborder: this.props.frameborder || "0"
        };
    },
    render: function() {
        return (
            <portal.Mashetes.Mashete title={this.state.displayedTitle} config={this.props}>
                <div className="centeredText">
                    <iframe
                        className={this.state.displayedClass}
                        src={this.state.displayedUrl}
                        title={this.state.displayedTitle}
                        allowTransparency={this.state.displayedAllowTransparency}
                        frameBorder={this.state.displayedFrameborder}
                        width={this.state.displayedWidth}
                        height={this.state.displayedHeight}
                    ></iframe>
                </div>
            </portal.Mashetes.Mashete>
        );
    }
});

