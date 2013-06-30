/*
 * Copyright 1999-2004 Carnegie Mellon University.
 * Portions Copyright 2004 Sun Microsystems, Inc.
 * Portions Copyright 2004 Mitsubishi Electric Research Laboratories.
 * All Rights Reserved.  Use is subject to license terms.
 *
 * See the file "license.terms" for information on usage and
 * redistribution of this file, and for a DISCLAIMER OF ALL
 * WARRANTIES.
 *
 */

package Zeus.zeus_commands;

import edu.cmu.sphinx.frontend.util.Microphone;
import edu.cmu.sphinx.recognizer.Recognizer;
import edu.cmu.sphinx.result.*;
import edu.cmu.sphinx.decoder.search.Token;
import edu.cmu.sphinx.util.props.ConfigurationManager;

import java.net.*;
import java.io.*;
import java.util.*;
import java.text.DecimalFormat;

/* XML Parsing */
import org.w3c.dom.*;
import org.xml.sax.SAXException;
import javax.xml.parsers.*;
import javax.xml.xpath.*;

public class ZeusCommands {

    private static DecimalFormat format = new DecimalFormat("#.#####");
    private static Document config_xml;
    private static HashMap server_auth = new HashMap();

    public static void main(String[] args) {
        System.out.println("Zeus powering up ...");

        /* Load Sphinx Configuration */
        ConfigurationManager cm = new ConfigurationManager(ZeusCommands.class.getResource("sphinx.config.xml"));

        // Create lock commands hash.
        HashMap lock_commands = new HashMap() {{

            put("zeus", (String) "Zeus");
            put("how is the weather", (String) "Weather");

        }};

        System.out.println("Starting...");

        Recognizer recognizer = (Recognizer) cm.lookup("recognizer");
        recognizer.allocate();

        System.out.println("Configuring...");

        // start the microphone or exit if this is not possible
        Microphone microphone = (Microphone) cm.lookup("microphone");
        if (!microphone.startRecording()) {
            System.out.println("Cannot start microphone.");
            recognizer.deallocate();
            System.exit(1);
        }

        System.out.println("Zeus is Ready");
        Startup_Zeus();

        // Loop the recognition until the program exits.
        while (true) {

            Result result = recognizer.recognize();

            if (result != null) {

                ConfidenceScorer cs = (ConfidenceScorer) cm.lookup("confidenceScorer");
                ConfidenceResult cr = cs.score(result);
                Path best = cr.getBestHypothesis();

                // Print linear confidence of the best path
                System.out.println(best.getTranscription());
                System.out.println
                        ("     (confidence: " +
                                format.format(best.getLogMath().logToLinear
                                        ((float) best.getConfidence()))
                                + ')');
                System.out.println();

                String resultText = result.getBestFinalResultNoFiller().trim();

                // Look up resultText in lock_commands hash
                String cmd = (String)lock_commands.get(resultText);

                System.out.println("[" + resultText + "]");

                if (cmd != "") {
                    System.out.println("Sending Command: " + cmd + '\n');
                    SendCommand(cmd);
                } else {
                    System.out.println("I can't hear what you said.\n");
                }
            }
        }
    }

    // Starting up Zeus
    private static void Startup_Zeus(){
        URL u;
        InputStream is = null;
        DataInputStream dis;
        String s;

        try {
            System.out.println("Starting Zeus");
            u = new URL("http://localhost:8888/");
            is = u.openStream();
            Thread.sleep(400);
        } 
        catch (Exception e) {
        
        }
    }
    // Sends an HTTP POST request to Node.JS Client
    private static void SendCommand(String cmd) {  

        URL u;
        InputStream is = null;
        DataInputStream dis;
        String s;

        try {
            if(cmd == "Zeus"){
                System.out.println("Starting");
                u = new URL("http://localhost:8888/yessir");
                is = u.openStream();
                Thread.sleep(100);
            }
            else if(cmd == "Weather") {
                System.out.println("Asking for Weather");
                u = new URL("http://localhost:8888/weather");
                is = u.openStream();
                Thread.sleep(800);
            }
            else {

            }
        } catch (Exception e) {
        }
    }
}

