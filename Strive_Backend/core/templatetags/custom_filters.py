from django import template

register = template.Library()

@register.filter
def length_is(value, arg):
    """
    Custom template filter to replace the removed length_is filter.
    Returns True if the length of value equals arg.
    """
    try:
        return len(value) == int(arg)
    except (TypeError, ValueError):
        return False
