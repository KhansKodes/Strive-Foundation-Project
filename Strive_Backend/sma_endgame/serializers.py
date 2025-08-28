from rest_framework import serializers
from .models import EndgamePage, Objective

class ObjectiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Objective
        fields = ("order", "title", "description")

class EndgamePageSerializer(serializers.ModelSerializer):
    objectives = ObjectiveSerializer(many=True, read_only=True)

    class Meta:
        model = EndgamePage
        fields = (
            "title", "subtitle",
            "objectives",
            "plan_heading", "plan_subheading", "plan_url",
        )
