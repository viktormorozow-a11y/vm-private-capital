VM PRIVATE SUITE
================

Upload this folder as the root of your existing static website.

Structure:
  /index.html      -> VM Private Capital / Wealth Studio
  /hrt/index.html  -> HRT Health Studio

Both pages use the same Supabase authentication project.
If you are already signed in on the main site, /hrt/ opens without a second login.
A direct visit to /hrt/ also requires the same Supabase account.

Important:
HRT data itself still uses browser localStorage in this version.
Authentication is shared, but HRT data is not yet synchronized to Supabase.
