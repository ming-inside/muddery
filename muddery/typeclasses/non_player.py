"""
None Player Characters

Player Characters are (by default) Objects setup to be puppeted by Players.
They are what you "see" in game. The Character class in this module
is setup to be the "default" character type created by the default
creation commands.

"""

from __future__ import print_function

from muddery.mappings.typeclass_set import TYPECLASS
from muddery.utils.localized_strings_handler import _


class MudderyNonPlayerCharacter(TYPECLASS("CHARACTER")):
    """
    The character not controlled by players.
    """
    typeclass_key = "NON_PLAYER"
    typeclass_name = _("General NPC", "typeclasses")
