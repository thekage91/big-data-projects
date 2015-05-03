import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.TaskReport;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;

import ex2.SecondStepMapper;
import ex2.SecondStepReducer;
import ex2.StatisticMapper;
import ex2.StatisticReducer;
import ex4.EserciseAFirstReducer;
import ex4.ExerciseAFirstMapper;
import ex4.ExerciseASecondMapper;
import ex4.ExerciseASecondReducer;


public class BillingJobs extends Configured implements Tool{
	public static final Log LOG = LogFactory.getLog(BillingJobs.class);
	
	public int run(String[] args) throws Exception {

		Configuration conf = getConf();
		Job job1 = Job.getInstance(conf, "Trimester Statistics 1 step");
		Job job2 = Job.getInstance(conf, "Trimester Statistics 2 step");
		Job job3 = Job.getInstance(conf, "Associative p1->p2 statistic 1 step");
		Job job4 = Job.getInstance(conf, "Associative p1->p2 statistic 2 step");

		Double start;
		Double end;
		Double ex2TotalTime, ex4TotalTime;
		SimpleDateFormat dateFormat = new SimpleDateFormat("d-MMM-yyyy HH:mm:ss");
         
		 
		job1.setJarByClass(BillingJobs.class);
		job1.setMapperClass(StatisticMapper.class);
		job1.setReducerClass(StatisticReducer.class);
		job1.setOutputKeyClass(Text.class);
		job1.setOutputValueClass(IntWritable.class);
		FileInputFormat.addInputPath(job1, new Path(args[0]));
		FileOutputFormat.setOutputPath(job1, new Path("temp"));
		

		job2.setJarByClass(BillingJobs.class);
		job2.setMapperClass(SecondStepMapper.class);
		job2.setReducerClass(SecondStepReducer.class);
		job2.setOutputKeyClass(Text.class);
		job2.setOutputValueClass(Text.class);
		FileInputFormat.addInputPath(job2, new Path("temp"));
		FileOutputFormat.setOutputPath(job2,new Path(args[1]));
		
		job3.setJarByClass(BillingJobs.class);
		job3.setMapperClass(ExerciseAFirstMapper.class);
		job3.setReducerClass(EserciseAFirstReducer.class);
		job3.setOutputKeyClass(Text.class);
		job3.setOutputValueClass(IntWritable.class);
		FileInputFormat.addInputPath(job3, new Path(args[0]));
		FileOutputFormat.setOutputPath(job3,new Path("temp"));
		
		job4.setJarByClass(BillingJobs.class);
		job4.setMapperClass(ExerciseASecondMapper.class);
		job4.setReducerClass(ExerciseASecondReducer.class);
		job4.setOutputKeyClass(Text.class);
		job4.setOutputValueClass(Text.class);
		FileInputFormat.addInputPath(job4, new Path("temp"));
		FileOutputFormat.setOutputPath(job4,new Path(args[1]));
		
//		start = (double)new Date().getTime();
//		job1.waitForCompletion(true);
//		job2.waitForCompletion(true);
//		end = (double)new Date().getTime();
//		ex4TotalTime = ((end - start) / 1000);
//		LOG.info("Exercise 2 Jobs took " + ex4TotalTime + " seconds.");
		
		start = (double)new Date().getTime();
		job3.waitForCompletion(true);         
		job4.waitForCompletion(true);
		end = (double)new Date().getTime();
		ex4TotalTime = ((end - start) / 1000);
		LOG.info("Exercise A Jobs took " + ex4TotalTime + " seconds.");
		return 0;
		
		

	}

	public static void main(String[] args) throws Exception{
		int res = ToolRunner.run(new Configuration(), new BillingJobs(), args);
		System.exit(res);
	}
}
