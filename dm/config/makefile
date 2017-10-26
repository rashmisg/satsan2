DIRS=../include \
     ../lib     \
     ../bin \
     ../downloads \
     ../downloads/forms \
     ../downloads/components \
     ../downloads/help \
     ../downloads/res

DEVDIRS=../log \
	../temp

default: $(DIRS) clean config

devdirs: $(DEVDIRS)

$(DIRS):
	mkdir $@

$(DEVDIRS):
	mkdir $@

clean:
	@rm -f config.cache config.log config.status

config:
	@./configure --with-RELEASE=$(RELEASE)
