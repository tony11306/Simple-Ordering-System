from flask import jsonify, abort
from flask.helpers import make_response
from flask_restful import Resource, reqparse
import json
import datetime

class History(Resource):

    def __init__(self):
        self.reqparse_args = reqparse.RequestParser()
        self.reqparse_args.add_argument('dateBegin', type=str, required=False)
        self.reqparse_args.add_argument('dateEnd', type=str, required=False)
        super().__init__()

    def get(self):
        with open('./database/order_history.json', 'r', encoding='utf-8') as f:
            history = json.load(f)
        
        dateBegin = self.reqparse_args.parse_args()['dateBegin']
        dateEnd = self.reqparse_args.parse_args()['dateEnd']
        
        if dateBegin and dateEnd:
            dateBegin = datetime.datetime.strptime(dateBegin, '%Y%m%d')
            dateEnd = datetime.datetime.strptime(dateEnd, '%Y%m%d')
            if dateBegin > dateEnd:
                abort(400, "起始日期不能大於結束日期")

            result = {}
            for key in history:
                if dateBegin <= datetime.datetime.strptime(history[key]['訂購時間'], '%Y-%m-%d %H:%M:%S') <= dateEnd:
                    result[key] = history[key]
            return jsonify(result)
        
        if dateBegin:
            dateBegin = datetime.datetime.strptime(dateBegin, '%Y%m%d')
            result = {}
            for key in history:
                if dateBegin <= datetime.datetime.strptime(history[key]['訂購時間'], '%Y-%m-%d %H:%M:%S'):
                    result[key] = history[key]
            return jsonify(result)
        
        if dateEnd:
            dateEnd = datetime.datetime.strptime(dateEnd, '%Y%m%d')
            result = {}
            for key in history:
                if datetime.datetime.strptime(history[key]['訂購時間'], '%Y-%m-%d %H:%M:%S') <= dateEnd:
                    result[key] = history[key]
            return jsonify(result)

        return jsonify(history)