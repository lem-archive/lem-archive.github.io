'use strict';

const sidebar_items = document.querySelector('#sidebar_items');
const root = ReactDOM.createRoot(sidebar_items);

const page_body = document.querySelector('#page_body');
const page_body_root = ReactDOM.createRoot(page_body);
const e = React.createElement;
function resizeIframe(obj) {
    obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
  }
const processData = (data) => {
    console.log(data)
    return data.map(x => {
        console.log(x)
        return e(SidebarItem, {
            item_info: {
                name: x[0],
                url: x[1],
                type: x[1].includes('githubusercontent.com') ? 'file' : 'dir'
            }
        })
    })
}

function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
class SidebarItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: guidGenerator()
        }

        if (this.props.item_info.type == 'dir') {
            this.doshit()
        } else {
            this.setState({
                data: null
            })
        }
    }

    async doshit() {
        console.log(this.props.item_info)
        const response = await fetch(this.props.item_info.url);
        const data = await response.json();


        this.setState({
            data: data
        })
    }
    render() {
        if (typeof (this.state.data) == 'object' || this.props.item_info.type == 'file') {
            console.log(this.props.item_info.url, this.state.data)
            return e(
                'li',
                {
                    className: 'list-group-item'
                },
                e(
                    'button',
                    {
                        onClick: () => {
                            if (this.props.item_info.type == 'file') {
                                console.log(this.props.item_info.url)
                                if (this.props.item_info.url.includes('.pdf')) {
                                    page_body_root.render(e(
                                        //<iframe src="https://viewscreen.githubusercontent.com/view/pdf?enc_url=" height="8294px" width="100%" style="display:block;border:0;padding:0;" ></iframe>
                                        'iframe',
                                        {
                                            id: 'iframe_id',
                                            src: `https://viewscreen.githubusercontent.com/view/pdf?enc_url=${this.props.item_info.url.split("")
                                                .map(c => c.charCodeAt(0).toString(16).padStart(2, "0"))
                                                .join("")}`,
                                            width: "100%",
                                            //height: '191512515px',
                                          // height: "100%",
                                            style: {
                                                display: 'block',
                                                border: 0,
                                                padding: 0
                                            },
                                            frameBorder:"0",
                                            scrolling:"no",
                                            onLoad: (e) => {
                                                document.getElementById('iframe_id').style.height = document.getElementById('iframe_id').contentWindow.document.body.scrollHeight + 'px';
                                            }
                                        }
                                    ));

                                } else {
                                    page_body_root.render(e(
                                        'img',
                                        {
                                            src: this.props.item_info.url,
                                            width: "100%",
                                            style: {
                                                display: 'block',
                                                border: 0,
                                                padding: 0
                                            }
                                        }
                                    ));
                                }

                            }
                        },
                        'data-bs-toggle': 'collapse',
                        'data-bs-target': this.props.item_info.type == 'file' ? '#navbarContent' : '#' + this.state.id,
                        className: this.props.item_info.type == 'dir' ? 'btn btn-dark' : 'btn btn-secondary',
                        type: 'button',
                        'aria-expanded': false,
                        'aria-controls': this.props.item_info.type == 'file' ? 'navbarContent' : this.state.id
                    },
                    this.props.item_info.name,

                ),
                this.props.item_info.type == 'dir' ? e(
                    'ul',
                    {
                        className: 'list-group collapse',
                        id: this.state.id
                    },
                    processData(this.state.data)
                )

                    : ''



            );
        }

        return e(
            'div'
        )
    }
}

const getData = async (path) => {
    let url = `https://sugared-mellow-trawler.glitch.me/lem_archive/LEM${path}`
    const data = await response.json();

    console.log(all.join());
}

(async () => {
    let url = `https://sugared-mellow-trawler.glitch.me/LEM`
    const response = await fetch(url)
    const data = await response.json();



    root.render(e(
        'ul',
        {
            className: 'list-group b-example-divider ',
            width: '80%'
        },
        processData(data)
    ));
})()