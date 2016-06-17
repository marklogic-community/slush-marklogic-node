#
# Put your custom functions in this class in order to keep the files under lib untainted
#
# This class has access to all of the private variables in deploy/lib/server_config.rb
#
# any public method you create here can be called from the command line. See
# the examples below for more information.
#
class ServerConfig

  #
  # You can easily "override" existing methods with your own implementations.
  # In ruby this is called monkey patching
  #
  # first you would rename the original method
  # alias_method :original_deploy_modules, :deploy_modules

  # then you would define your new method
  # def deploy_modules
  #   # do your stuff here
  #   # ...

  #   # you can optionally call the original
  #   original_deploy_modules
  # end

  #
  # you can define your own methods and call them from the command line
  # just like other roxy commands
  # ml local my_custom_method
  #
  # def my_custom_method()
  #   # since we are monkey patching we have access to the private methods
  #   # in ServerConfig
  #   @logger.info(@properties["ml.content-db"])
  # end

  #
  # to create a method that doesn't require an environment (local, prod, etc)
  # you woudl define a class method
  # ml my_static_method
  #
  # def self.my_static_method()
  #   # This method is static and thus cannot access private variables
  #   # but it can be called without an environment
  # end

  # Show-casing some useful overrides, as well as fixing some module doc permissions
  alias_method :original_deploy_modules, :deploy_modules
  alias_method :original_deploy_rest, :deploy_rest
  alias_method :original_clean, :clean

  def deploy_modules
    # Uncomment deploy_packages if you would like to use MLPM to deploy MLPM packages.
    # You can also move mlpm.json into src/ext/ and deploy plain modules (not REST extensions) that way.
    #deploy_packages
    original_deploy_modules
  end
  
  def deploy_packages
    password_prompt
    system %Q!mlpm deploy -u #{ @ml_username } \
                          -p #{ @ml_password } \
                          -H #{ @properties['ml.server'] } \
                          -P #{ @properties['ml.app-port'] }!
    fix_permissions(@properties["ml.modules-db"])
  end
  
  def deploy_rest
    original_deploy_rest
    fix_permissions(@properties["ml.modules-db"])
  end

  def fix_permissions(where)
    logger.info "Fixing permissions in #{where} for documents:"
    if where.include? "content"
      # This is useful to make sure alert configuration is accessible 
      r = execute_query(
        %Q{
          xquery version "1.0-ml";

          for $uri in cts:uri-match("*alert*")
          return (
            $uri,
            xdmp:document-set-permissions($uri, (
              xdmp:permission("#{@properties["ml.app-name"]}-role", "read"),
              xdmp:permission("#{@properties["ml.app-name"]}-role", "update"),
              xdmp:permission("#{@properties["ml.app-name"]}-role", "execute")
            ))
         )
        },
        { :db_name => where }
      )
    else
      r = execute_query(
        %Q{
          xquery version "1.0-ml";

          for $uri in cts:uris()
          where not(ends-with($uri, "/"))
          return (
            $uri,
            xdmp:document-set-permissions($uri, (
              xdmp:permission("#{@properties["ml.app-name"]}-role", "read"),
              xdmp:permission("#{@properties["ml.app-name"]}-role", "update"),
              xdmp:permission("#{@properties["ml.app-name"]}-role", "execute")
            ))
         )
        },
        { :db_name => where }
      )
    end

    r.body = parse_json r.body
    logger.info r.body
    logger.info ""
  end
  
  def clean
    what = ARGV.shift

    case what
      when 'collections'
        clean_collections
      else
        ARGV.unshift what
        original_clean
    end
  end

  def clean_collections()
    what = ARGV.shift
    r = execute_query(
      %Q{
        xquery version "1.0-ml";

        for $collection in fn:tokenize("#{what}", ",")
        where fn:exists(fn:collection($collection)[1])
        return (
          xdmp:collection-delete($collection),
          "Cleaned collection " || $collection
        )
      },
      { :db_name => @properties["ml.content-db"]}
    )
    r.body = parse_json r.body
    logger.info r.body
  end

end

#
# Uncomment, and adjust below code to get help about your app_specific
# commands included into Roxy help. (ml -h)
#

#class Help
#  def self.app_specific
#    <<-DOC.strip_heredoc
#
#      App-specific commands:
#        example       Installs app-specific alerting
#    DOC
#  end
#
#  def self.example
#    <<-DOC.strip_heredoc
#      Usage: ml {env} example [args] [options]
#      
#      Runs a special example task against given environment.
#      
#      Arguments:
#        this    Do this
#        that    Do that
#        
#      Options:
#        --whatever=value
#    DOC
#  end
#end
