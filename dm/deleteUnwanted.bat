set dir=%REFSDIR%\build\packaging
del /q "%REFSDIR%*"
FOR /D %%p IN ("%dir%\buildfiles","%dir%\stash\Deploy\mobile","%dir%\settings\defaults","%dir%\web\refs\tests","%dir%\web\util")  DO rmdir "%%p" /s /q
del "%dir%\settings\rpweb-template.xml"
@RD /S /Q "%dir%\stash\Deploy\i18n\1.0"
