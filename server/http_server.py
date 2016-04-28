#!/usr/local/bin/python3

import cherrypy
import os


class HttpServer(object):

    @cherrypy.expose
    def index(self):
        with open("../app/index.html", 'r') as file:
            js_str = file.read()
            data = bytes(js_str, 'utf-8')
        return data

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
            'tools.staticdir.root': os.path.abspath(os.getcwd()+"/../app")
        },
        '/bundlejs': {
            'tools.response_headers.on': True,
            'tools.response_headers.headers': [('Content-Type', 'application/javascript')],
        },
        '/static': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './build'
        },
        '/js': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './scripts'
        },
        '/tests': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './tests'
        }
    }
    cherrypy.quickstart(HttpServer(), '/', conf)
