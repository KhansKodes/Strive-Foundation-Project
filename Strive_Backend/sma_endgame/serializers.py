from rest_framework import serializers
from .models import EndgamePage, Objective, InfoSection

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

class InfoSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoSection
        fields = ("slug", "title", "description")