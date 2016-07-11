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

  # Show-casing some useful overrides, as well as adjusting some module doc permissions
  alias_method :original_deploy_modules, :deploy_modules
  alias_method :original_deploy_rest, :deploy_rest
  alias_method :original_deploy, :deploy
  alias_method :original_clean, :clean

  # Integrate deploy_packages into the Roxy deploy command
  def deploy
    what = ARGV.shift

    case what
      when 'packages'
        deploy_packages
      else
        ARGV.unshift what
        original_deploy
    end
  end

  def deploy_modules
    # Uncomment deploy_packages if you would like to use MLPM to deploy MLPM packages, and
    # include MLPM deploy in deploy modules to make sure MLPM depencencies are loaded first.

    # Note: you can also move mlpm.json into src/ext/ and deploy plain modules (not REST extensions) that way.

    #deploy_packages
    original_deploy_modules
  end
  
  def deploy_packages
    password_prompt
    system %Q!mlpm deploy -u #{ @ml_username } \
                          -p #{ @ml_password } \
                          -H #{ @properties['ml.server'] } \
                          -P #{ @properties['ml.app-port'] }!
    change_permissions(@properties["ml.modules-db"])
  end
  
  def deploy_rest
    original_deploy_rest
    change_permissions(@properties["ml.modules-db"])
  end

  # Permissions need to be changed for executable code that was not deployed via Roxy directly,
  # to make sure users with app-role can read and execute it. Typically applies to artifacts
  # installed via REST api, which only applies permissions for rest roles. Effectively also includes
  # MLPM, which uses REST api for deployment. It often also applies to artifacts installed with
  # custom code (via app_specific for instance), like alerts.
  def change_permissions(where)
    logger.info "Changing permissions in #{where} for:"
    r = execute_query(
      %Q{
        xquery version "1.0-ml";

        let $new-permissions := (
          xdmp:permission("#{@properties["ml.app-name"]}-role", "read"),
          xdmp:permission("#{@properties["ml.app-name"]}-role", "update"),
          xdmp:permission("#{@properties["ml.app-name"]}-role", "execute")
        )

        let $uris :=
          if (fn:contains(xdmp:database-name(xdmp:database()), "content")) then

            (: This is to make sure all alert files are accessible :)
            cts:uri-match("*alert*")

          else

            (: This is to make sure all triggers, schemas, modules and REST extensions are accessible :)
            cts:uris()

        let $fixes := 
          for $uri in $uris
          let $existing-permissions := xdmp:document-get-permissions($uri)
        
          (: Only apply new permissions if really necessary (gives better logging too):)
          where not(ends-with($uri, "/"))
            and count($existing-permissions[fn:string(.) = $new-permissions/fn:string(.)]) ne 3
        
          return (
            "  " || $uri,
            xdmp:document-set-permissions($uri, $new-permissions)
          )
        return
          if ($fixes) then
            $fixes
          else
            "  no changes needed.."
      },
      { :db_name => where }
    )
    r.body = parse_json r.body
    logger.info r.body
    logger.info ""
  end

  # Integrate clean_collections into the Roxy clean command
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

class Help
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
  class <<self
    alias_method :original_deploy, :deploy

    def deploy
      # Concatenate extra lines of documentation after original deploy
      # Help message (with a bit of indent to make it look better)
      original_deploy + "  " +
      <<-DOC.strip_heredoc
        packages    # deploys MLPM modules and REST extensions using MLPM to the app-port
      DOC
    end
    alias_method :original_clean, :clean

    def clean
      # Concatenate extra lines of documentation after original clean
      # Help message (with a bit of indent to make it look better)
      original_clean + "\n  " +
      <<-DOC.strip_heredoc
        collections WHAT
            # removes all files from (comma-separated list of) WHAT collection(s) in the content database
      DOC
    end
  end
end
