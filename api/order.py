from flask import jsonify, abort
from flask.helpers import make_response
from flask_restful import Resource, reqparse
import json
from datetime import datetime

class Order(Resource):
    def __init__(self):
        self.reqparse_args = reqparse.RequestParser()
        self.reqparse_args.add_argument('order', type=dict, required=True, location='json')
        super().__init__()

    def _cacl_order_price(self, order):
        with open('./database/food_ingredient_info.json', 'r', encoding='utf-8') as f:
            food_infos = json.load(f)

        price = 0
        for food in order:
            price += food_infos[food]['價格'] * order[food]
        return price

    def _store_order(self, order):
        with open('./database/order_history.json', 'r', encoding='utf-8') as f:
            orders = json.load(f)
        current_order_id = len(orders)
        orders[current_order_id] = {
            '訂購時間': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            '訂購內容': order,
            '總金額': self._cacl_order_price(order)
        }
        with open('./database/order_history.json', 'w', encoding='utf-8') as f:
            f.write(json.dumps(orders, ensure_ascii=False))

    def _has_enough_ingredients(self, food_infos, order):
        with open('./database/ingredient_stock.json', 'r', encoding='utf-8') as f:
            ingredient_stock = json.load(f)

        ingredient_required = {}

        for food in order:
            for ingredient in food_infos[food]['食材']:
                if ingredient not in ingredient_required:
                    ingredient_required[ingredient] = order[food] * food_infos[food]['食材'][ingredient]
                else:
                    ingredient_required[ingredient] += order[food] * food_infos[food]['食材'][ingredient]
                print(ingredient_required[ingredient])

        for ingredient in ingredient_required:
            if ingredient_required[ingredient] > ingredient_stock[ingredient]["庫存"]:
                return False
        return True

    def post(self):
        args = self.reqparse_args.parse_args()
        order = args['order']
        with open('./database/food_ingredient_info.json', 'r', encoding='utf-8') as f:
            food_infos = json.load(f)

        if not self._has_enough_ingredients(food_infos, order):
            abort(400, "食材不夠")

        with open('./database/ingredient_stock.json', 'r', encoding='utf-8') as f:
            ingredient_stock = json.load(f)

        with open('./database/ingredient_stock.json', 'w', encoding='utf-8') as f:
            for food in order:
                for ingredient in food_infos[food]['食材']:
                    ingredient_stock[ingredient]["庫存"] -= order[food] * food_infos[food]['食材'][ingredient]
            f.write(json.dumps(ingredient_stock, ensure_ascii=False))
        self._store_order(order)
        return jsonify({'message': '訂購成功'})