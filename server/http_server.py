import cherrypy
import os


class HttpServer(object):

    @cherrypy.expose
    def index(self):
        return "Hello world!"

    @cherrypy.expose
    def bundlejs(self):
        data = b''
        os.system('./bundle_gen.sh')
        with open("../app/build/bundle.js", 'r') as file:
            js_str = file.read()
            data = bytes(js_str, 'utf-8')
        return data

if __name__ == '__main__':
    conf = {
        '/': {
            'tools.staticdir.root': os.path.abspath(os.getcwd())
        },
        '/bundlejs': {
            'tools.response_headers.on': True,
            'tools.response_headers.headers': [('Content-Type', 'application/javascript')],
        },
        '/static': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './static'
        },
        '/tests': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './static/tests/'
        }
    }
    cherrypy.quickstart(HttpServer(), '/', conf)
