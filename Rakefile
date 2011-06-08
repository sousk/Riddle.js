closure_command = "closure --compilation_level ADVANCED_OPTIMIZATIONS "
jsfiles = Dir.glob("./src/*.js").reject { |f| f =~ /min/ }

task :default => [:build, :build_all, :show]

task :build do
  sh closure_command + "--js ./src/riddle.js > ./src/riddle.min.js"
end

task :build_all do
  sh closure_command + jsfiles.map { |f| "--js " + f }.join(" ") + " > src/riddle-all.min.js"
end

task :show do
  sh "ls -lh ./src"
end
